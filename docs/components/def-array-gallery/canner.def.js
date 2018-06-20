/** @jsx c */

import c from 'canner-script';

const Gallery = ({attributes}) => (
  <array {...attributes}>
    <string keyName="title" />
    <image keyName="img" />
  </array>
)

export default Gallery
