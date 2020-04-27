const config = {
  '.*{js,ts}': ['eslint --fix', 'prettier --write'],
  '.*{md,json,js,ts}': ['prettier --write'],
  '*.{png,jpeg,jpg,gif}': ['imagemin-lint-staged'],
  '*.scss': ['stylelint'],
  '*.svg': (filenames) =>
    filenames.map((filename) => `svgo --config .svgo.yml --input ${filename}`),
};

module.exports = config;
