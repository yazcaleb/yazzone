const { getEssays } = require('./app/essays/utils.ts');
const essays = getEssays();
const listedEssays = essays.filter(e => !e.metadata.unlisted);
console.log('Total essays:', essays.length);
console.log('Listed essays:', listedEssays.length);
const homepageEssays = listedEssays
  .sort((a, b) =>
    Number(Boolean(b.metadata.pinned)) - Number(Boolean(a.metadata.pinned)) ||
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )
  .slice(0, 3);
console.log('Homepage essays:', homepageEssays.map(e => e.metadata.title).join(', '));
