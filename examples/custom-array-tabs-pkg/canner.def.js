/** @jsx builder */
import builder from 'canner-script';

module.exports = function({attributes, children}) {
  return (
    <array {...attributes}>
      {children}
    </array>
  );
}
