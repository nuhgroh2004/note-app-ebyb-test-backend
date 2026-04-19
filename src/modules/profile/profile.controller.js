const asyncHandler = require("../../utils/asyncHandler");
const { getProfile, getProfileDashboard } = require("./profile.service");

const detail = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.userId);

  return res.status(200).json({
    message: "Profile fetched",
    data: profile,
  });
});

const dashboard = asyncHandler(async (req, res) => {
  const data = await getProfileDashboard(req.userId);

  return res.status(200).json({
    message: "Profile dashboard fetched",
    data,
  });
});

module.exports = {
  detail,
  dashboard,
};
