import path from 'path';
import fs from 'fs';

export default function createEntryFile({
  appPath,
  entryPath,
  i18nMessages,
  baseUrl
}: {
  appPath: string,
  entryPath: string,
  i18nMessages: Record<string, any>,
  baseUrl: string
}) {
  const templateCode = generateTemplate({appPath, baseUrl, i18nMessages});
  fs.writeFileSync(entryPath, templateCode);
}

function toNodePath(p) {
  return p.replace(/\\/g, '/')
}

function generateTemplate({
  appPath,
  i18nMessages,
  baseUrl
}) {
  let locales = [];
  if (i18nMessages.en) {
    locales = Object.keys(i18nMessages);
  } else {
    locales = Object.keys(i18nMessages).concat('en');
  }
  return `
import React from 'react';
import ReactDOM from 'react-dom';
import App from '${toNodePath(appPath)}';
import {IntlProvider, addLocaleData} from 'react-intl';

const messages = ${JSON.stringify(i18nMessages, null, 2)};
${locales.map(locale => `
import ${locale} from 'react-intl/locale-data/${locale}';
`).join('\n')};
addLocaleData([
  ${locales.map(locale => `
  ...${locale}
  `).join(',')}
])
const locale = localStorage.getItem('locale') || 'en';

ReactDOM.render(
  <IntlProvider
    locale={locale}
    message={{
      ...messages[locale]
    }}
    defaultLocale="en"
  >
    <App
      baseUrl={'${baseUrl}'}
      intl={{
        locale,
        messages,
        defaultLocale: 'en'
      }}
    />
  </IntlProvider>,
  document.getElementById('root')
);
`;
}
