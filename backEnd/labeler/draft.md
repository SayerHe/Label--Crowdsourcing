- 刚刚进入batch，将 TaskLog，SalaryLog，Label 存入临时表中
- 在batch中，更新临时表中的数据
- batch结束时，将临时表中的数据推到正式表