'use strict'

const Env = use('Env'),
  Mail = use('Mail'),
  Juno = require('juno-api'),
  moment = require('moment'),
  Scheduling = use('App/Models/Scheduling'),
  Broker = use('App/Models/Broker'),
  PdfPrinter = require('pdfmake'),
  axios = require('axios'),
  fonts = {
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
  },
  printer = new PdfPrinter(fonts),
  fs = require('fs'),
  Helpers = use('Helpers')

class JunoController {
  async makeCharges({ request, response }) {
    try {
      let juno = new Juno({
        clientId: Env.get('JCLIENT_ID'),
        clientSecret: Env.get('JCLIENT_SECRET'),
        isProd: Env.get('JIS_PROD')
      });

      let token = await juno.authorization.accessToken(),
        count = 0;
      const firstDay = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'),
        lastDay =  moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
        brokers = await Broker.query()
        .with('services')
        .with('client')
        .fetch();

      brokers.toJSON().forEach(async broker => {
        let services = [],
          value = 0,
          clients = broker.client.map(client => client.id),
          dueDate =  moment().date(broker.dia_vencimento).format('YYYY-MM-DD'),
          bodyText = [];

        bodyText.push([
          {
            text: 'Data',
            style: 'header',
            alignment: 'center',
          },{
            text: 'Imobiliaria',
            style: 'header',
            alignment: 'center',
          },{
            text: 'Servico',
            style: 'header',
            alignment: 'center',
          },{
            text: 'Valor',
            style: 'header',
            alignment: 'center',
          },{
            text: 'Endereco',
            style: 'header',
            alignment: 'left',
          },{
            text: 'Obs',
            style: 'header',
            alignment: 'center',
          }]);

        broker.services.map(service => {
          services.push({
            id: service.pivot.service_id,
            price: service.pivot.price,
            name: service.name,
            qtd: 0
          });
        });

        let schedulings = await Scheduling.query()
          .where('client_id', 'in', clients)
          .where('date', '>=', firstDay)
          .where('date', '<=', lastDay)
          .where('actived', 1)
          .where('completed', 1)
          .with('services')
          .fetch();

        schedulings.toJSON().map(scheduling => {
          scheduling.services.map(service => {
            services.map(item => {

              if(item.id === service.pivot.service_id) {
                value += service.pivot.price
                item.qtd++;

                bodyText.push([
                  {
                    text: moment(scheduling.date).format('DD/MM'),
                    alignment: 'center',
                  },{
                    text: broker.name,
                    alignment: 'center',
                  },{
                    text: item.name,
                    alignment: 'center',
                  },{
                    text: 'R$ ' + service.pivot.price,
                    alignment: 'center',
                  },{
                    text: scheduling.address,
                    alignment: 'left',
                  }
                ]);
              }

            })
          });
        })

        let description = '';

        services.map(item => {
          description += ` ${item.name}: ${item.qtd},`;
        })

        description = description.substring(0, description.length - 1);

        bodyText.push([ '', '', '', '', '', '']);
        bodyText.push([ '', '', '', {text: 'R$ ' + value, alignment: 'center'}, '', '']);

        const docDefinition = {
          content: [
            {
              style: 'table',
              table: {
                headerRows: 1,
                body: bodyText
              },
              layout: 'noBorders'
            },
          ],
          styles: {
            header: {
              bold: true,
              fillOpacity:0.35,
              fillColor:'blue'
            },
            table: {
              margin: [20, 30, 20, 30]
            },
          },
          defaultStyle: {
            border: 'none'
          },
          pageOrientation: 'landscape',
          pageMargins: [ 20, 20, 20, 20 ]
        };

        if(value > 0) {
          count = count + 1;
          const path = `relatorio-sheephouse${count}.pdf`;
          var pdfDoc = printer.createPdfKitDocument(docDefinition);
          pdfDoc.pipe(fs.createWriteStream(path));
          pdfDoc.end();

          fs.unlinkSync(path);

          if(broker.id == 1) {
            axios.post(Env.get('JURL') + 'charges',
            {
              charge: {
                description,
                amount: value,
                dueDate,
                installments: 1,
                maxOverdueDays: 29,
                paymentTypes: ['BOLETO'],
              },
              billing: {
                name: broker.name,
                document: broker.cnpj,
                email: broker.email,
                notify: true
              }
            }, {
              headers: {
                'X-Api-Version': 2,
                'X-Resource-Token': Env.get('JRESOURCE_TOKEN'),
                'Authorization': `Bearer ${token.access_token}`
              }
            })
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = JunoController
