const formidable = require('formidable');
const ObjectID = require('mongodb').ObjectID;
const fs_mover = require('fs-extra'); 
const fs = require('fs'); 
const path = require('path');
const LocationModel = require('../models/locations');
const multiparty = require('multiparty');

const edit = async (req, res) => {
  try {
    const form_data = new multiparty.Form();
    form_data.parse(req, async function (err, fields, files) {
      const id = fields['id'][0];
      let location = {};
      if (id == 0) {
        location = new LocationModel();
      } else {
        location = await LocationModel.findById(id);
      }
      location.name = fields['name'][0];
      location.address = fields['address'][0];
      location.email = fields['email'][0];
      location.phone = fields['phone'][0];
      location.openTime = fields['openTime'][0];
      location.closeTime = fields['closeTime'][0];
      location.priceId = fields['priceId'][0];
      location.description = fields['description'][0];
      location.stationType = fields['stationType'][0];
      location.operationalMonths = fields['operationalMonths'][0].split(",");
      location.images = fields['oldImages'][0].split(",");
      if(files.files) {
        for (let i = 0; i < files.files.length; i++) {
          const time = new Date().getTime();
          const fileName = Buffer.from(time + "_" + files.files[i].originalFilename, 'utf8').toString('hex');
          const sourcePath = files.files[i].path;
          
          const directoryPath = path.join(__dirname, '../uploads/images');
          const  destpath = directoryPath + '/' + fileName;
          await fs_mover.move(sourcePath, destpath);
          location.images.push(fileName);
        }
      }
      await location.save();
      return res.status(200).json({ success: true });
    });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ msg: "Server Error" });
  }
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
        $or: [{ name: new RegExp('.*' + keyword + '.*') }, { address: new RegExp('.*' + keyword + '.*') }, { email: new RegExp('.*' + keyword + '.*') }],
        isDelete: {$ne: true}
      }
    }

    query = [
      {
        $match: match
      },
      {
        $lookup: {
          from: 'prices',
          localField: "priceId",
          foreignField: "_id",
          as: 'price'
        }
      },
      {$unwind: "$price"},
      {
        $sort: { createdAt: -1 }
      }
    ];
    query.push({ $count: 'totalCount' });
    const totalCnt = await LocationModel.aggregate(query);
    console.log(totalCnt)
    query.splice(query.length - 1, 1);
    query.push({ "$skip": currentPage * length });
    query.push({ "$limit": length });
    const data = await LocationModel.aggregate(query);
    return res.status("200").json({ data, totalPage: (Math.floor((totalCnt.length > 0 ? totalCnt[0].totalCount : 0) / length) + 1) });

  } catch (e) {
    console.log(e)
    return res.status(503).json({ msg: "Server Error" });
  }
}

const deleteItem = async (req, res) => {
  const { id } = req.body;
  try {
    const price = await LocationModel.findById(id);
    price.isDelete = true;
    await price.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ "msg": "Server Error" });
  }
}

const getItem = async (req, res) => {
  const { id } = req.body;
  try {
    const query = [
      {
        $match: { _id: ObjectID(id) }
      },
      {
        $lookup: {
          from: 'prices',
          localField: "priceId",
          foreignField: "_id",
          as: 'price'
        }
      },
      { $unwind: "$price" },
    ];
    const data = await LocationModel.aggregate(query);
    return res.status(200).json({ data: data[0] });
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