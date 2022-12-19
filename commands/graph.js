const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { registerFont } = require("canvas")
const { getRunData, getStartOfPeriod } = require('../utils/helpers')
const User = require('../models/User')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('graph')
		.setDescription('Shows the mileage for user and others (optional) in a graph!')
    .addStringOption(option => option.setName('period')
    .setDescription('Choose length of time period')
    .setRequired(true)
    .addChoices(
              { name: 'day', value: 'day' },
              { name: 'week', value: 'week' },
              { name: 'month', value: 'month' },
              { name: 'year', value: 'year' }
    ))
    .addUserOption(option => option.setName('user').setDescription('Compare your activity with another user')),
      async execute(interaction) {
        const unitOfTime = interaction.options._hoistedOptions.filter(option => option.name == 'period')[0].value
        console.log(getStartOfPeriod(new Date(), unitOfTime))
        const [dates, dataset] = await getRunData(interaction.user.id, unitOfTime, 3)
        const datasets = [dataset]
        const users = [interaction.user.username]
          // if (interaction.options._hoistedOptions.filter(option => option.name == 'user').length > 0) {
          //     let other = interaction.options._hoistedOptions.filter(option => option.name == 'user')[0]
          //     run_data = await getRunData(other.user.id, unit_of_time, -1)
          //     datasets.push({
          //         username : other.user.username,
          //         dates : run_data.dates,
          //         data : run_data.distances
          //     })
          // }
          // let min_length = Math.min(datasets.map(dataset => dataset.length))
          // datasets.map(dataset => { 
          //     return {
          //         username : dataset.username,
          //         dates : dataset.dates.reverse().slice(0, min_length),
          //         data : dataset.data.reverse().slice(0, min_length) 
          //     }
          // })
        const graph = await plotData(dates, datasets, users, unitOfTime)
        console.log(graph)
        await interaction.reply(
          // 'lol'
          {files: [graph]}
        )
      }
};


async function plotData(dates, datasets, users, unitOfTime) {
  const chartCallback = (ChartJS) => {}
  const width = 1400
  const height = 900
  const canvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback,
      backgroundColour: '#222732'
  }, )
  
  registerFont("./assets/CourierPrime-Regular.ttf", { family: "Courier" })
  const image = await canvas.renderToBuffer(getConfig(dates, datasets, users))
  const attachment = new MessageAttachment(image)
  return attachment
}



function getConfig(labels, datasets, users, unitOfTime) {
  return {
    type: 'line',
      data: {
        labels: labels,
        datasets: datasets.map( (dataset, i) => {
          console.log(i, dataset)
          return {
            label: users[i],
            data: dataset,
            backgroundColor: backgroundColors[i],
            borderWidth: 1,
            pointBackgroundColor: 'white',
            pointBorderColor: 'white',
            borderColor: '#05CBE1',
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
              up: 20,
              bottom: 20,
          }
        },
      plugins : {
        legend: {                        
          display: false,
          labels : {
            color: 'white',
            font: {
                family: font,
                size: 20,
                weight: '500',
            }
          }
        },
        title: {
          display: true,
          text: users.join(' v ') + ` Mileage (Last ${labels.length} ${unitOfTime}s)`,
          font: {
              size: 30,
              family: font
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
          ticks: {
            callback: function(value, index, ticks) {
                return value + 'km';
            },
            color: 'white',
            font: {
                family: font,
                size: 20,
                weight: '500',
            }
          },
          position: 'left'
        },
        x: {
          ticks: {
            color: 'white',
            font: {
                family: font,
                size: 20,
                weight: '500',
            }
          }
        }
      }
    }
  }
  return config
}

// chart configurations
const font = 'ShareTech'

const backgroundColors = [
  function (context) {
      const gradient = context.chart.ctx.createLinearGradient(600, 0, 600, 800);
      gradient.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
      gradient.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 231, 255, 0)');
      return gradient;
  },
  function (context) {
      const gradient = context.chart.ctx.createLinearGradient(600, 0, 600, 800);
      gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
      gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      return gradient;
  },
]