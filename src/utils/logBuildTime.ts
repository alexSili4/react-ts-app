// Лише в прод-збірці: у dev __BUILD_TIME__ — час старту dev-сервера, а не
// збірки. undefined у DateTimeFormat — мова й часовий пояс браузера. Поля
// окремо, а не dateStyle/timeStyle: з ними timeZoneName кидає TypeError, і
// падає вся сторінка ще до рендеру.
const logBuildTime = (): void => {
  if (!import.meta.env.PROD) {
    return;
  }

  const buildTime = new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(__BUILD_TIME__));

  console.info(`Збірка: ${buildTime}`);
};

export default logBuildTime;
