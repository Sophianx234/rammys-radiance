const fs = require('fs');
const glob = require('fs').readdirSync;
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');
let changedFiles = 0;

files.forEach(f => {
  try {
    let c = fs.readFileSync(f, 'utf8');
    let orig = c;

    // Replace $130 with GH₵130
    c = c.replace(/\$([0-9]+)/g, 'GH₵$1');
    
    // Replace >$< with >GH₵< (like <span>$</span>)
    c = c.replace(/>\$/g, '>GH₵');

    // Replace "Price: $$" with "Price: GH₵$" (in email templates)
    c = c.replace(/Price:\s*\$\$/g, 'Price: GH₵$');

    // Replace $ followed by template interpolation of price/total e.g. ${product.price}
    // We target `$` right before `{` that are inside JSX or template literals, but we ONLY want to target currency ones.
    // e.g. `${product.price}`
    c = c.replace(/\$\{([^}]*?(?:price|total|Amount|revenue)[^}]*?)\}/gi, (match, p1) => {
      // if it's preceded by $ in the original, we want to replace that preceding $ with GH₵.
      // But JS replace doesn't easily do lookbehinds for all engines.
      return match;
    });
    
    // Simpler: just search for `$${` in template literals and replace with `GH₵${`
    c = c.replace(/\$\$\{/g, 'GH₵${');
    
    // In JSX, a literal dollar sign before a JSX expression is just `$`.
    // e.g. `> ${` or `> ${`
    c = c.replace(/>\s*\$\s*\{/g, '>GH₵{');
    c = c.replace(/"\$\s*\{/g, '"GH₵{');
    c = c.replace(/`\$\s*\{/g, '`GH₵{');
    c = c.replace(/\(\$\s*\{/g, '(GH₵{');
    c = c.replace(/:\s*"\$"/g, ': "GH₵"');
    c = c.replace(/:\s*'\$'/g, ": 'GH₵'");

    if (c !== orig) {
      fs.writeFileSync(f, c);
      console.log('Updated ' + f);
      changedFiles++;
    }
  } catch(e) {
    console.error('Error in ' + f + ': ' + e.message);
  }
});

console.log('Total files changed: ' + changedFiles);
