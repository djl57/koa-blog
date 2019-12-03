const router = require("koa-router")();
const officegen = require("officegen");
const fs = require("fs");

router.post("/exportWord", async ctx => {
  // const body = ctx.request.body;
  // console.log("-----body----", body);
  let docx = officegen("docx");
  docx.on("finalize", function(written) {
    console.log("Finish to create a Microsoft Word document.");
  });
  docx.on("error", function(err) {
    console.log(err);
  });
  // Create a new paragraph:
  // let pObj = docx.createP();

  // pObj.addText("简单文本");
  // pObj.addText(" 有颜色的文本", { color: "000088" });
  // pObj.addText(" 有背景的文本", { color: "00ffff", back: "000088" });

  // pObj = docx.createP();

  // pObj.addText("文本 ");
  // pObj.addText("文本", {
  //   back: "00ffff",
  //   shdType: "pct12",
  //   shdColor: "ff0000"
  // }); // Use pattern in the background.
  // pObj.addText(" 文本 ");
  // pObj.addText("文本 ", { highlight: true }); // Highlight!
  // pObj.addText("文本", { highlight: "darkGreen" }); // Different highlight color.

  // pObj = docx.createP();

  // pObj.addText("文本 ");
  // pObj.addText("链接", { link: "https://github.com" });
  // pObj.addText("!");

  pObj = docx.createP();

  pObj.addText("Bold + underline", { bold: true, underline: true });

  // pObj = docx.createP({ align: "center" });

  // pObj.addText("Center this text", {
  //   border: "dotted",
  //   borderSize: 12,
  //   borderColor: "88CCFF"
  // });

  // pObj = docx.createP();
  // pObj.options.align = "right";

  // pObj.addText("Align this text to the right.");

  // pObj = docx.createP();

  // pObj.addText("Those two lines are in the same paragraph,");
  // pObj.addLineBreak();
  // pObj.addText("but they are separated by a line break.");

  // docx.putPageBreak();

  // pObj = docx.createP();

  // pObj.addText("Fonts face only.", { font_face: "Arial" });
  // pObj.addText(" Fonts face and size.", {
  //   font_face: "Arial",
  //   font_size: 40
  // });

  // docx.putPageBreak();

  // pObj = docx.createP();

  // // We can even add images:
  // // pObj.addImage("cover01.png");

  // // Let's generate the Word document into a file:
  let timeStamp = new Date().getTime();
  let out = fs.createWriteStream(`example - ${timeStamp}.docx`);
  console.log(out);
  out.on("error", function(err) {
    console.log(err);
  });

  // // Async call to generate the output file:
  docx.generate(out);

  var config = new qiniu.conf.Config();
  // 空间对应的机房
  config.zone = qiniu.zone.Zone_z0;
  // 是否使用https域名
  //config.useHttpsDomain = true;
  // 上传是否使用cdn加速
  //config.useCdnDomain = true;

  ctx.body = { code: "200", msg: "" };
});

module.exports = router;
