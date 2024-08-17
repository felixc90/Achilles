import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder, SlashCommandIntegerOption, SlashCommandStringOption, SlashCommandUserOption, UserSelectMenuBuilder } from "discord.js";
import { UserService } from "../services";
import { Period } from "../types";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { ChartConfiguration } from "chart.js";
import { registerFont } from "canvas";
import { User } from "../../db";

interface ChartInput {
	labels: string[], 
	datasets: Dataset[], 
	titleText: string,
	fontFamily: string,
	yTicksCallback: (value: string | number) => string
}

interface Dataset {
	label: string,
	data: number[]
}

export const data = new SlashCommandBuilder()
  .setName("graph")
  .setDescription("Displays a graph showing run history!")
	.addStringOption(
		new SlashCommandStringOption()
			.setName('period')
			.setDescription('Choose time period')
			.setRequired(true)
			.addChoices(
				{ name: Period.Day, value: Period.Day },
				{ name: Period.Week, value: Period.Week },
				{ name: Period.Month, value: Period.Month },
				{ name: Period.Year, value: Period.Year },
			))
		.addIntegerOption(
			new SlashCommandIntegerOption()
				.setName("count")
				.setDescription("How many periods")
				.setMinValue(0)
				.setRequired(true)
		)
		.addUserOption(
			new SlashCommandUserOption()
				.setName('user')
				.setDescription('Add a user to compare against')
		)

export async function execute(interaction: CommandInteraction) {
	if (
		typeof interaction.options.get('period')?.value != 'string' ||
		typeof interaction.options.get('count')?.value != 'number'
	) return;
	const period = interaction.options.get('period')?.value as Period;
	const count = interaction.options.get('count')?.value as number;

	const userService = new UserService(interaction.user.id);
	const data = await userService.getAggregatedRuns(period, count);

	registerFont("./assets/CourierPrime-Regular.ttf", { family: "Courier" })
	const chartInput = {
		labels: data.map(x => toChartLabel(x._id, period)),
		titleText: ` Mileage (Last ${count} ${period}s)`,
		datasets: [ { label: interaction.user.username, data: data.map(x => x.distance / 1000) } ],
		fontFamily: 'Courier',
		yTicksCallback: function(value: number | string) {
			return value + 'km';
		}
	}

	const otherUser = interaction.options.get('user');
	if (typeof otherUser?.value == 'string' && await User.findById(otherUser?.value)) {
		const otherUserService = new UserService(otherUser?.value.toString());
		const aggRuns = await otherUserService.getAggregatedRuns(period, count);
		chartInput.datasets.push({
			label: otherUser.user?.username ?? "",
			data: aggRuns.map(x => x.distance / 1000)
		})
	}

	const chart = await createChart(chartInput);

	return interaction.reply({ files: [chart] });
}

async function createChart(chartData: ChartInput) {
  const width = 1400
  const height = 900
  const canvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback: (ChartJS) => {},
      backgroundColour: '#222732'
  })
	const config = createConfiguration(chartData);
  const image = await canvas.renderToBuffer(config);
  const attachment = new AttachmentBuilder(image)
  return attachment
}

function createConfiguration({ 
	labels, 
	datasets, 
	titleText, 
	fontFamily, 
	yTicksCallback 
}: ChartInput): ChartConfiguration {
  const config: ChartConfiguration = {
    type: 'line',
      data: {
        labels: labels,
        datasets: datasets.map((dataset, i) => {
          return {
            label: dataset.label,
            data: dataset.data,
            borderWidth: 1,
            backgroundColor: backgroundColors[i],
            borderColor: borderColors[i],
            pointBackgroundColor: 'white',
            pointBorderColor: 'white',
            fill: true,
            cubicInterpolationMode: 'monotone',
            tension: 0.2,
          }
      }),},
      options: {
        layout: {
          padding: {
              right: 40,
              left: 20,
              top: 20,
              bottom: 20,
          }
        },
      plugins : {
        legend: {                        
          display: true,
          labels : {
            color: 'white',
            font: {
                family: fontFamily,
                size: 20,
                weight: '500',
            }
          }
        },
        title: {
          display: true,
          text: titleText,
          font: {
              size: 30,
              family: fontFamily
          },
          padding: {
              top: 15,
              bottom: 20,
          },
          color: 'white',
        }
      },
      scales: {
        y: {
          min: 0,
          ticks: {
            callback: yTicksCallback,
            color: 'white',
            font: {
                family: fontFamily,
                size: 20,
                weight: '500',
            },
          },
          position: 'left'
        },
        x: {
          ticks: {
            color: 'white',
            font: {
                family: fontFamily,
                size: 20,
                weight: '500',
            }
          }
        }
      }
    }
  }
  return config;
}

const backgroundColors = [
  function (context: any) {
      const gradient = context.chart.ctx.createLinearGradient(600, 0, 600, 800);
      gradient.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      gradient.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
      return gradient;
  },
  function (context: any) {
      const gradient = context.chart.ctx.createLinearGradient(600, 0, 600, 800);
      gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      return gradient;
  },
]

const borderColors = [
  '#05CBE1',
  '#FC2525',
]

function toChartLabel(dateString: string, period: Period) {
	let res = ""

	const d = new Date(dateString);
	switch (period) {
		case Period.Day:
		case Period.Week:
			res = d.toLocaleString('default', { day: '2-digit', month: '2-digit' });
			break;
		case Period.Month:
			res = d.toLocaleString('default', { month: 'short', year: '2-digit' });
			break;
		case Period.Year:
			res = d.toLocaleString('default', { year: 'numeric' });
			break;
		default:
			break;
	}

	return res;

}