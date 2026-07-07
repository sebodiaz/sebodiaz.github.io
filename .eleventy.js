module.exports = function (eleventyConfig) {
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.disable(["escape"])
  );

  return {
    dir: {
      input: "notes-src",
      output: "notes",
      includes: "_includes",
      layouts: "_layouts",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk"],
  };
};
