// @flow


export default function log(type: string, ...payload: any) {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  let color = "black";

  switch (type) {
    case "request":
      color = "Green";
      break;
    case "fetch":
      color = "DodgerBlue";
      break;
    case "deploy":
      color = "Red";
      break;
    case "subscribe":
      color = "Orange";
      break;
    case 'updateQuery':
      color = 'Brown';
      break;
    default:
      break;
  }
  // eslint-disable-next-line
  console.log("%c" + type, "color:" + color, ...payload);
}