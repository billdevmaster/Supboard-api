const PriceModel = require("../../models/prices");
const PriceDetailModel = require("../../models/priceDetails");

const edit = async (req, res) => {
  const { data, id } = req.body;
  let price;
  try {
    if (id != 0) {
      price = await PriceModel.findById(id);
      price.name = data.name;
      price.status = data.status;
      price.currency = data.currency;
      price.taxName = data.taxName;
      price.description = data.description;
      price.taxInclude = data.taxInclude;
      price.taxPercent = data.taxPercent;
      await price.save();
      const firstHourDetail = await PriceDetailModel.findOne({ priceId: id, time: "FirstHour" });
      for (let i = 0; i < data.firstHour.length; i++) {
        firstHourDetail[`day_${i}_price`] = data.firstHour[i];
      }
      await firstHourDetail.save();
      const restHourDetail = await PriceDetailModel.findOne({ priceId: id, time: "RestHour" });
      for (let i = 0; i < data.restHour.length; i++) {
        restHourDetail[`day_${i}_price`] = data.restHour[i];
      }
      await restHourDetail.save();
    } else {
      price = new PriceModel(data);
      price.createdBy = res.user.id;
      const newPrice = await price.save();

      // save first hour prices
      priceDetail = new PriceDetailModel();
      priceDetail.priceId = newPrice._id;
      priceDetail.time = "FirstHour";
      for (let i = 0; i < data.firstHour.length; i++) {
        priceDetail[`day_${i}_price`] = data.firstHour[i];
      }
      await priceDetail.save();

      // save rest hour prices
      priceDetail = new PriceDetailModel();
      priceDetail.priceId = newPrice._id;
      priceDetail.time = "RestHour";
      for (let i = 0; i < data.restHour.length; i++) {
        priceDetail[`day_${i}_price`] = data.restHour[i];
      }
      await priceDetail.save();
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ success: false, msg: "Server Error" });
  }
}

const getList = async (req, res) => {
  const { currentPage, length, keyword } = req.body;
  try {
    if (keyword == "") {
      const match = {isDelete: {$ne: true}}
      const totalCnt = await PriceModel.countDocuments(match);
      const data = await PriceModel.find(match).sort({ createdAt: -1 }).skip(currentPage * length).limit(length);
      return res.status("200").json({ data, totalPage: (Math.floor(totalCnt / length) + 1) });
    } else {
      const match = { name: new RegExp('.*' + keyword + '.*'), isDelete: {$ne: true} };
      const totalCnt = await PriceModel.countDocuments(match);
      const data = await PriceModel.find(match).sort({createdAt: -1}).skip(currentPage * length).limit(length);
      return res.status("200").json({ data, totalPage: (Math.ceil(totalCnt / length)) });
    }
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const getListByCreator = async (req, res) => {
  try {
    const match = { createdBy: res.user.id, isDelete: {$ne: true}, status: "Active" };
    const data = await PriceModel.find(match);
    return res.status(200).json({ data });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const getPrice = async (req, res) => {
  let retData = {firstHour: [], restHour: []};
  const { id } = req.body;
  try {
    const price = await PriceModel.findById(id);
    const priceDetail = await PriceDetailModel.find({ priceId: id });
    retData.name = price.name;
    retData.status = price.status;
    retData.currency = price.currency;
    retData.taxName = price.taxName;
    retData.description = price.description;
    retData.taxInclude = price.taxInclude;
    retData.taxPercent = price.taxPercent;
    priceDetail.map((item) => {
      if (item.time == "FirstHour") {
        for (let i = 0; i < 7; i++) {
          retData.firstHour.push(item[`day_${i}_price`]);
        }
      } else {
        for (let i = 0; i < 7; i++) {
          retData.restHour.push(item[`day_${i}_price`]);
        }
      }
    })
    return res.status(200).json({ data: retData });
  } catch (e) {
    console.log(e)
    return res.status("503").json({ msg: "Server Error" });
  }
}

const deleteItem = async (req, res) => {
  const { id } = req.body;
  try {
    const price = await PriceModel.findById(id);
    price.isDelete = true;
    await price.save();
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e)
    return res.status(503).json({ "msg": "Server Error" });
  }
}

module.exports = {
  edit,
  getList,
  getPrice,
  deleteItem,
  getListByCreator
}