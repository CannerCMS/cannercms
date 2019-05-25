/** @jsx builder */

// eslint-disable-next-line
import builder from '../src';

// eslint-disable-next-line
module.exports = (
  <root>
    <array keyName="posts">
      <object keyName="status">
        <dateTime keyName="createAt" />
        <boolean keyName="draft" />
      </object>
      <file keyName="featureImage" contentType="image" />
      <object keyName="pageProperty">
        <boolean keyName="onTop" />
        <number keyName="order" />
      </object>
      <object keyName="share">
        <boolean keyName="showShareBottom" />
        <boolean keyName="showGoodBottom" />
      </object>
      <object keyName="other">
        <string keyName="introduction" />
        <geoPoint keyName="position" />
      </object>
    </array>
  </root>
);
