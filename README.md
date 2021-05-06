# nodePrinter

Nodeprinter is a simple nodejs rest api that uses a fork of the node-printer repo and combines them with node-thermal-printer
the way it works is that you can send commands to the localhost:1337/printer-data in an object as follows
{ 
printerName: string;
printerCommands: string[]
}

effortless example: 
 let printerData = {
        printerName: "nodePrinter",
        printerCommands: [
          "printer.newLine()",
          "printer.newLine()",
          "printer.alignLeft()",
          `printer.println('Fecha: ${format(
            fromUnixTime(sale.createdAt),
            "dd/MM/yy HH:mm"
          )}')`,
          "printer.newLine()",
          `printer.println('Cliente: ${
            sale.customer ? sale.customer.razonYRuc : "Sin nombre"
          }')`,
          `printer.println('Forma de pago: ${paymentTypeName(
            sale.paymentType
          )}')`,
          "printer.alignLeft()",
          ...productsList,
          "printer.alignCenter()",
          "printer.newLine()",
          `printer.println('Total: ${sale.total}')`,
          "printer.newLine()",
          "printer.newLine()",
          "printer.newLine()",
          "printer.drawLine()",
          "printer.newLine()",
          "printer.newLine()",
        ],
      };
