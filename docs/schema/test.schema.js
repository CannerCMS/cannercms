/** @jsx builder */

import builder, {Default, Condition, Block, Row, Col} from 'canner-script';
import moment from 'moment-timezone';

const ceDesc = `All events that had been collected so far.`;

export function renderDate(date, record, cannerProps) {
  if (!date) {
    return '-';
  } else {
    let value = moment.tz(date, "Asia/Nicosia").format("YYYY/MM/DD HH:mm");
    return value;
  }
}

export default () => (
  <array keyName="events" title="Events" ui="table" description={ceDesc}
    uiParams={{
      size: "small",
      columns: [{
        title: 'Translated',
        dataIndex: 'translated'
      }, {
        title: 'Ready',
        dataIndex: 'ready'
      }, {
        title: 'Title',
        dataIndex: 'title'
      }, {
        title: 'Date Start',
        dataIndex: 'dateStart',
        render: renderDate
      }, {
        title: 'Date End',
        dataIndex: 'dateEnd',
        render: renderDate
      }, {
        title: 'City',
        dataIndex: 'city'
      }, {
        title: 'Tags',
        dataIndex: 'tags'
      }]
    }}
  >
    <toolbar>
      <pagination/>
      <actions>
        <filter />
        <export />
      </actions>
      <filter>
        <textFilter field="city" label="City" placeholder="Nicosia"/>
        <textFilter field="title" label="Title"/>
        <dateFilter field="dateStart" label="Date start"/>
        <selectFilter field="translated" label="Translated" defaultOptionIndex={0} alwaysDisplay options={[
          { text: "Not translated", condition: { translated: { eq: false } } },
          { text: "Translated", condition: { translated: { eq: true } } },
          { text: "All", condition: {} }
        ]}/>
        <selectFilter field="ready" label="Ready" options={[
          { text: "Not ready", condition: { ready: { eq: false } }},
          { text: "Ready", condition: { ready: { eq: true } }},
          { text: "All", condition: {}},
        ]}/>
        <selectFilter field="old" label="Old" defaultOptionIndex={0} options={[
          { text: "Only new", condition: { old: { eq: false }} },
          { text: "Old", condition: { old: { eq: true } }},
          { text: "All", condition: {}},
        ]}/>
      </filter>
      <sorter defaultField="dateStart" options={[{label: 'Date Start', field: 'dateStart', defaultOrder: 'ASC'}]}/>
    </toolbar>
    <Row>
      <Col span={12}>
        <Block title="Original event">
          <Row>
            <Col span={12}>
              <dateTime keyName="dateStart" ui="dateTime" uiParams={{format:"YYYY/MM/DD HH:mm", render:renderDate}} title="Date start"/>
              <dateTime keyName="dateEnd" ui="dateTime" uiParams={{format:"YYYY/MM/DD HH:mm", render:renderDate}} title="Date end"/>
              <string keyName="url" ui="link" title="URL" disabled={true}/>
              <string keyName="parentUrl" ui="link" title="Parent URL" disabled={true}/>
            </Col>
            <Col span={11} offset={1}>
              <image keyName="thumbnail" ui="image" title="Thumbnail" disabled={true}/>
            </Col>
          </Row>
        </Block>
      </Col>
      <Col span={11} offset={1}>
        <Block title="Common classification">
          <array keyName="tags" ui="tag" title="Tags" uiParams={{
            defaultOptions: [
              'theater', 'movie', 'party',
              'festival', 'kids', 'concert',
              'play', 'masterclass', 'music',
              'tasting', 'exhibition', 'sport'
            ]}}/>
          <string keyName="city" ui="select" title="City" uiParams={{options: [{text:"Nicosia", value: "Nicosia"}, {text:"Larnaca", value: "Larnaca"}, {text:"Paphos", value: "Paphos"}, {text:"Limassol", value: "Limassol"},]}}/>
          <string keyName="language" ui="input" title="Event language"/>
        </Block>
      </Col>
    </Row>
    <Row type="flex" style={{alignItems: 'center'}}>
      <Col span={12}>
        <string keyName="title" ui="input" title="Title" disabled={true}/>
        <Row>
          <Col span={8}><string keyName="location" ui="input" title="Location" disabled={true}/></Col>
          <Col span={15} offset={1}><string keyName="address" ui="input" title="Address" disabled={true}/></Col>
        </Row>
        <string keyName="description" ui="textarea" title="Description" disabled={true}/>
      </Col>
      <Col span={12}>
        <array keyName="translation" title="Translations" ui="tabTop" uiParams={{titleKey: "language", position: "right"}}>
          <string keyName="language" title="Language" ui="select" uiParams={{options: [{text: 'Russian', value: 'ru'}, {text: "English", value: 'en'}, {text: "Greek", value: 'el'}]}}/>
          <string keyName="title" title="Title" ui="input"/>
          <Row>
            <Col span={8}><string keyName="location" ui="input" title="Location"/></Col>
            <Col span={15} offset={1}><string keyName="address" ui="input" title="Address"/></Col>
          </Row>
          <string keyName="description" ui="textarea" title="Description"/>
          <string keyName="contact" ui="input" title="Contact and details"/>
        </array>
      </Col>
    </Row>
    <Row>
      <Block title="Event control">
        <Row>
          <Col span={5}><boolean keyName="translated" ui="switch" title="Mark as translated"/></Col>
          <Col span={5}><boolean keyName="ready" ui="switch" title="Ready"/></Col>
          <Col span={5}><boolean keyName="loaded" ui="switch" title="Loaded"/></Col>
          <Col span={5}><boolean keyName="old" ui="switch" title="Old"/></Col>
          <Col span={5}><string keyName="source" ui="input" title="Event Source" disabled={true}/></Col>
        </Row>
      </Block>
    </Row>
  </array>
);