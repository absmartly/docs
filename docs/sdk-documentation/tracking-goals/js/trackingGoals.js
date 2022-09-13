exp.track("goal_name", { ...properties });

var properties = {
  price: 10000,
  category: "5 stars",
  free_cancellation: true,
  instance_id: 5350,
};
exp.track("booking", properties);
