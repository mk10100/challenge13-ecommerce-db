const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });

    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: [{ model: Product }],
    });

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json(tag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagId = req.params.id;
    const [updatedRows] = await Tag.update(req.body, {
      where: {
        id: tagId,
      },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.json({ message: "Tag updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagId = req.params.id;
    const deletedRowCount = await Tag.destroy({
      where: { id: tagId },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    await ProductTag.destroy({
      where: { tag_id: tagId },
    });

    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
