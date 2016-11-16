import Recipe from '../utils/factory';
import base from './components/base';
import header from './components/header';
import footer from './components/footer';
import plot from './components/plot';
import qualifier from './components/qualifier';
import tips from './components/tips';
import shareData from './components/share-data';
import social from './components/social';
import { custom } from '../../../custom/custom';

/**
 * Chart contruction manager class.
 * @module charts/manager
 */

export class ChartManager {

  constructor(container, obj) {
    this.recipe = new Recipe(obj);

    this.recipe.rendered = {};

    const rendered = this.recipe.rendered;

    // check that each section is needed

    if (this.recipe.options.head) {
      rendered.header = header(container, this.recipe);
    }

    if (this.recipe.options.footer) {
      rendered.footer = footer(container, this.recipe);
    }

    const node = base(container, this.recipe);

    rendered.container = node;

    rendered.plot = plot(node, this.recipe);

    if (this.recipe.options.qualifier) {
      rendered.qualifier = qualifier(node, this.recipe);
    }

    if (this.recipe.options.tips) {
      rendered.tips = tips(node, this.recipe);
    }

    if (!this.recipe.editable && !this.recipe.exportable) {
      if (this.recipe.options.share_data) {
        rendered.shareData = shareData(container, this.recipe);
      }
      if (this.recipe.options.social) {
        rendered.social = social(container, this.recipe);
      }
    }

    if (this.recipe.CUSTOM) {
      rendered.custom = custom(node, this.recipe, rendered);
    }

  }

}
