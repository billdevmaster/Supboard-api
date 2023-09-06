const TerrainModel = require("../../models/terrains");

const edit = async (req, res) => {
  const { data, id } = req.body;
  let terrain;
  try {
    if (id != 0) {
      terrain = await TerrainModel.findById(id);
    } else {
      terrain = new TerrainModel(data);
    }
    terrain.name = data.name;
    terrain.status = data.status;
    await terrain.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ success: false, msg: "Server Error" });
  }
}

const getList = async (req, res) => {
  const { currentPage, length, keyword } = req.body;
  try {
    let match = {};
    if (keyword == "") {
      match = {isDelete: {$ne: true}}
    } else {
      match = { name: new RegExp('.*' + keyword + '.*'), isDelete: {$ne: true} };
    }
    const totalCnt = await TerrainModel.countDocuments(match);
    const data = await TerrainModel.find(match).sort({createdAt: -1}).skip(currentPage * length).limit(length);
    return res.status("200").json({ data, totalPage: (Math.ceil(totalCnt / length)) });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const deleteItem = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await TerrainModel.findById(id);
    data.isDelete = true;
    await data.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const getItem = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await TerrainModel.findById(id);
    return res.status(200).json({ data });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

module.exports = {
  edit,
  getList,
  deleteItem,
  getItem
}