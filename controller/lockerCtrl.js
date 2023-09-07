const LockerModel = require('../models/lockers');

const edit = async (req, res) => {

}

const getList = async (req, res) => {
  try {
    const { currentPage, length, keyword } = req.body;
    let query = [];
    let match = {};
    if (keyword == "") {
      match = {isDelete: {$ne: true}}
    } else {
      match = {
        $or: [{ name: new RegExp('.*' + keyword + '.*') }],
        isDelete: {$ne: true}
      }
    }
    query = [
      {
        $match: match
      },
      {
        $lookup: {
          from: 'stations',
          localField: "stationId",
          foreignField: "_id",
          as: 'station'
        }
      },
      {$unwind: "$station"},
      {
        $sort: { createdAt: -1 }
      }
    ];
    query.push({ $count: 'totalCount' });
    const totalCnt = await LockerModel.aggregate(query);
    query.splice(query.length - 1, 1);
    query.push({ "$skip": currentPage * length });
    query.push({ "$limit": length });
    const data = await LockerModel.aggregate(query);
    return res.status("200").json({ data, totalPage: (Math.floor((totalCnt.length > 0 ? totalCnt[0].totalCount : 0) / length) + 1) });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ "msg": "Server Error" });
  }
}

const deleteItem = async (req, res) => {

}

const getItem = async (req, res) => {
  const { id } = req.body;
  try {
    const item = await LockerModel.findById(id);
    return res.status(200).json({ data: item });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ "msg": "Server Error" });
  }
}

module.exports = {
  edit,
  getList,
  deleteItem,
  getItem
}