const StationModel = require("../../models/stations");

const edit = async (req, res) => {
  const { data, id } = req.body;
  let item;
  try {
    if (id != 0) {
      item = await StationModel.findById(id);
    } else {
      item = new StationModel();
      item.createdBy = res.user.id;
    }
    item.status = data.status;
    item.name = data.name;
    item.uuid = data.uuid;
    item.lockersCapacity = data.lockersCapacity;
    item.locationId = data.locationId;
    item.terrainId = data.terrainId;
    item.description = data.description;
    item.scanBoard = data.scanBoard;
    item.scanLifejacket = data.scanLifejacket;
    item.scanPaddle = data.scanPaddle;
    await item.save();
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
    query = [
      {
        $match: match
      },
      {
        $lookup: {
          from: 'locations',
          localField: "locationId",
          foreignField: "_id",
          as: 'location'
        }
      },
      {$unwind: "$location"},
      {
        $sort: { createdAt: -1 }
      }
    ];
    query.push({ $count: 'totalCount' });
    const totalCnt = await StationModel.aggregate(query);
    query.splice(query.length - 1, 1);
    query.push({ "$skip": currentPage * length });
    query.push({ "$limit": length });
    const data = await StationModel.aggregate(query);
    return res.status("200").json({ data, totalPage: (Math.floor((totalCnt.length > 0 ? totalCnt[0].totalCount : 0) / length) + 1) });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const deleteItem = async (req, res) => {
  const { id } = req.body;
  try {
    const data = await StationModel.findById(id);
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
    const data = await StationModel.findById(id);
    return res.status(200).json({ data });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const getListByUser = async (req, res) => {
  try {
    const data = await StationModel.find({ createdBy: res.user.id, isDelete: {$ne: true} });
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
  getItem,
  getListByUser
}