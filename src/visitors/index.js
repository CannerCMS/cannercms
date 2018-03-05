import fieldset from './fieldset';
import hocs from './hocs';
import validator from './validator';
import body from './body';
import layer1Fieldset from './layer1-2Fieldset';
import layer3Fieldset from './layer3Fieldset';
import layerGTE4Fieldset from './layerGTE4Fieldset';
import variants from './variants';

export default [
  ...layer1Fieldset,
  ...layer3Fieldset,
  ...layerGTE4Fieldset,
  ...fieldset,
  ...hocs,
  ...validator,
  ...body,
  ...variants,
];
