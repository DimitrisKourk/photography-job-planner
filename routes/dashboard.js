// Financial dashboard and associate analytics: /api/dashboard, /api/associateAnalytics
const express = require("express");
const { query } = require("../config/db");
const handle = require("../utils/handle");

const router = express.Router();

// ---- Monthly totals ----

router.get("/dashboard/monthlyIncome/:date", handle(async (req, res) => {
  const filter=req.params.date.split(',');
  const year=filter[1];
  const month=filter[0];
  const values=[year,month,year,month];
  const text = `select ifnull(sum(price),0) as 'MonthlyIncome'
                      from (
                        SELECT sum(price) as price FROM Jobs WHERE year(date)=? AND month(date)=?
                          union all
                          SELECT sum(price) as price FROM JobArchive WHERE year(date)=? AND month(date)=?
                      ) unionedtable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/monthlyExpenses/:date", handle(async (req, res) => {
  const filter=req.params.date.split(',');
  const year=filter[1];
  const month=filter[0];
  const values=[month,year,month,year];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as MonthlyExpenses
                from(
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0) + ifnull(editor_payment,0) + ifnull(printer_payment,0)) as allexpenses
                    from Jobs
                    where month(Jobs.date)=? and year(Jobs.date)=?
                    union all
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0) + ifnull(editor_payment,0) + ifnull(printer_payment,0)) as allexpenses
                    from JobArchive
                    where month(JobArchive.date)=? and year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/monthlyPaymentsExpenses/:date", handle(async (req, res) => {
  const filter=req.params.date.split(',');
  const year=filter[1];
  const month=filter[0];
  const values=[month,year,month,year];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as monthlyPaymentsExpenses
                from(
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0)) as allexpenses
                    from Jobs
                    where month(Jobs.date)=? and year(Jobs.date)=?
                    union all
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0)) as allexpenses
                    from JobArchive
                    where month(JobArchive.date)=? and year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/monthlyEditorExpenses/:date", handle(async (req, res) => {
  const filter=req.params.date.split(',');
  const year=filter[1];
  const month=filter[0];
  const values=[month,year,month,year];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as monthlyEditorExpenses
                from(
                    select sum(ifnull(editor_payment,0)) as allexpenses
                    from Jobs
                    where month(Jobs.date)=? and year(Jobs.date)=?
                    union all
                    select sum(ifnull(editor_payment,0)) as allexpenses
                    from JobArchive
                    where month(JobArchive.date)=? and year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/monthlyPrinterExpenses/:date", handle(async (req, res) => {
  const filter=req.params.date.split(',');
  const year=filter[1];
  const month=filter[0];
  const values=[month,year,month,year];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as monthlyPrinterExpenses
                from(
                    select sum(ifnull(printer_payment,0)) as allexpenses
                    from Jobs
                    where month(Jobs.date)=? and year(Jobs.date)=?
                    union all
                    select sum(ifnull(printer_payment,0)) as allexpenses
                    from JobArchive
                    where month(JobArchive.date)=? and year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

// ---- Yearly totals per category ----

router.get("/dashboard/IncomePerCategory/:data", handle(async (req, res) => {
  const filter=req.params.data.split(',');
  const year=filter[1];
  const category=filter[0];
  const values=[category,year,category,year];
  const text = `select ifnull(sum(unionedTable.incomeTotal),0) as incomeTotal
                from
                ( select sum(Jobs.price) as incomeTotal
                  from Jobs
                  where Jobs.job_type=? and year(Jobs.date)=?
                  union all
                  select sum(JobArchive.price) as incomeTotal
                  from JobArchive
                  where JobArchive.job_type=? and year(JobArchive.date)=?
                ) unionedTable`;
  res.json(await query(text, values));
}));

router.get("/dashboard/ExpensesPerCategory/:data", handle(async (req, res) => {
  const filter=req.params.data.split(',');
  const year=filter[1];
  const category=filter[0];
  const values=[category,year,category,year];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as Expenses
                from(
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0) + ifnull(editor_payment,0) + ifnull(printer_payment,0)) as allexpenses
                    from Jobs
                    where Jobs.job_type=? and year(Jobs.date)=?
                    union all
                    select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0) + ifnull(editor_payment,0) + ifnull(printer_payment,0)) as allexpenses
                    from JobArchive
                    where JobArchive.job_type=? and year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/PaymentsPerCategory/:data", handle(async (req, res) => {
  const filter=req.params.data.split(',');
  const year=filter[1];
  const category=filter[0];
  const values=[category,year,category,year];
  const text = `select ifnull(sum(unionedTable.amount),0) as paymentTotal
                from
                    (select  amount
                    from Jobs
                    inner join CustomerPayments on Jobs.id=CustomerPayments.job_id
                    where Jobs.job_type=? and year(Jobs.date)=?
                    union all
                    select amount
                    from JobArchive
                    inner join CustomerPayments on JobArchive.id=CustomerPayments.job_id
                    where JobArchive.job_type=? and year(JobArchive.date)=?
                ) unionedTable`;
  res.json(await query(text, values));
}));

router.get("/dashboard/jobCount/:data", handle(async (req, res) => {
  const filter=req.params.data.split(',');
  const year=filter[1];
  const category=filter[0];
  const values=[year,category,year,category];
  const text = `select count(job_type) as job_count
                  from (
                    SELECT job_type FROM Jobs WHERE (year(date)=? AND job_type=?)
                      union all
                      SELECT job_type FROM JobArchive WHERE (year(date)=? AND job_type=?)
                  ) unionedtable
                  `;
  res.json(await query(text, values));
}));

// ---- Yearly expenses per type ----

router.get("/dashboard/ExpensesPerType/EmployPayments/:date", handle(async (req, res) => {
  const date = req.params.date;
  const values = [date,date];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as Expenses
                from(
                  select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0)) as allexpenses
                  from Jobs
                  where  year(Jobs.date)=?
                  union all
                  select sum(ifnull(ph1_payment,0)+ ifnull(ph2_payment,0) + ifnull(vid1_payment,0) + ifnull(vid2_payment,0) + ifnull(drone_payment,0)) as allexpenses
                  from JobArchive
                  where year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/ExpensesPerType/EditorPayments/:date", handle(async (req, res) => {
  const date = req.params.date;
  const values = [date,date];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as Expenses
                from(
                  select sum(ifnull(editor_payment,0)) as allexpenses
                  from Jobs
                  where  year(Jobs.date)=?
                  union all
                  select sum(ifnull(editor_payment,0)) as allexpenses
                  from JobArchive
                  where year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

router.get("/dashboard/ExpensesPerType/PrinterPayments/:date", handle(async (req, res) => {
  const date = req.params.date;
  const values = [date,date];
  const text = `select ifnull(sum(unionedTable.allexpenses),0) as Expenses
                from(
                  select sum(ifnull(printer_payment,0)) as allexpenses
                  from Jobs
                  where  year(Jobs.date)=?
                  union all
                  select sum(ifnull(printer_payment,0)) as allexpenses
                  from JobArchive
                  where year(JobArchive.date)=?
                )unionedTable;`;
  res.json(await query(text, values));
}));

// ---- Associate analytics ----

router.get("/associateAnalytics/monthlyPayments/:data", handle(async (req, res) => {
      var data=req.params.data;
      data=data.split(',');
      const month=data[0];
      const year=data[1];
      const id=data[2];
      const values=[id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year,id,month,year];
      const text = `select position, sum(FinalUnionedTable.OneEmployeeExpenses) as AssociateMonthlyExpenses
                    from(
                        select position, unionedJobsTable.SingleEmployeeExpenses as OneEmployeeExpenses
                      from(
                        select 'Photographer1' as position,ifnull(sum(ph1_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  photographer1=? and month(date)=? and year(date)=?
                        union
                        select 'Photographer2' as position,ifnull(sum(ph2_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  photographer2=? and month(date)=? and year(date)=?
                        union
                        select 'Videographer1' as position,ifnull(sum(vid1_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  videographer1=? and month(date)=? and year(date)=?
                        union
                        select 'Videographer2' as position,ifnull(sum(vid2_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  videographer2=? and month(date)=? and year(date)=?
                        union
                        select 'Drone' as position,ifnull(sum(drone_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  drone=? and month(date)=? and year(date)=?
                        union
                        select 'Editor' as position,ifnull(sum(editor_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  video_editor=? and month(date)=? and year(date)=?
                        union
                        select 'Albums' as position,ifnull(sum(printer_payment),0) as SingleEmployeeExpenses
                        from Jobs
                        where  album_printer=? and month(date)=? and year(date)=?
                      )unionedJobsTable
                      union all
                      select position, unionedArchiveTable.SingleEmployeeExpenses as OneEmployeeExpenses
                      from(
                        select 'Photographer1' as position,ifnull(sum(ph1_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  photographer1=? and month(date)=? and year(date)=?
                        union
                        select 'Photographer2' as position,ifnull(sum(ph2_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  photographer2=? and month(date)=? and year(date)=?
                        union
                        select 'Videographer1' as position,ifnull(sum(vid1_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  videographer1=? and month(date)=? and year(date)=?
                        union
                        select 'Videographer2' as position,ifnull(sum(vid2_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  videographer2=? and month(date)=? and year(date)=?
                        union
                        select 'Drone' as position,ifnull(sum(drone_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  drone=? and month(date)=? and year(date)=?
                        union
                        select 'Editor' as position,ifnull(sum(editor_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  video_editor=? and month(date)=? and year(date)=?
                        union
                        select 'Albums' as position,ifnull(sum(printer_payment),0) as SingleEmployeeExpenses
                        from JobArchive
                        where  album_printer=? and month(date)=? and year(date)=?
                      )unionedArchiveTable
                    )FinalUnionedTable
                    group by FinalUnionedTable.position
                    order by FinalUnionedTable.position asc;;
  `;
  res.json(await query(text, values));
}));

module.exports = router;
