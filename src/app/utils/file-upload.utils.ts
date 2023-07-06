import { utils as XLSXUtils, read as readXLSX } from 'xlsx';

/**
 * @description: Method to apply to convert to json format from uploaded excel file.
 */
export function excelFiletoJSON<Type>(file: File): Promise<Type> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = readXLSX(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const dataList = XLSXUtils.sheet_to_json(worksheet, {
        raw: true,
      });
      resolve(dataList as Type);
    };
  });
}

/**
 * @description: Method to read csv file and convert it into JSON .
 */
export function csvFileToJSON<Type>(file: File): Promise<Type> {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: Event) => {
      const dataList = [];
      const headers = [];
      const rows = reader.result.split('\r\n');
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split(',');
        const rowData: any = {};
        for (let j = 0; j < cells.length; j++) {
          if (i == 0) {
            let headerName = cells[j].trim();
            headers.push(headerName);
          } else {
            let key = headers[j];
            if (key) {
              rowData[key] = cells[j].trim();
            }
          }
        }
        if (i != 0) {
          dataList.push(rowData);
        }
        resolve(dataList as Type);
      }
    };
  });
}
