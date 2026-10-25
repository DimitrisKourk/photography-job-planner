// shared globals (associates, products, dashboard totals) and the default year/month filter

window.history.replaceState({}, "", window.location.href.split("#")[0])
var MyAssociates=[];

var MyProducts=[];


//object for saving all necessary dashboard variables
var myDashboard={
  Baptism_number:0,
  Wedding_number:0,
  Gamobaptisi_number:0,
  Photo_number:0,
  Baptism_total_income:0,
  Wedding_total_income:0,
  Gamobaptisi_total_income:0,
  Photo_total_income:0,
  Baptism_payments:0,
  Wedding_payments:0,
  Gamobaptisi_payments:0,
  Photo_payments:0,
  Baptism_unpaid:0,
  Wedding_unpaid:0,
  Gamobaptisi_unpaid:0,
  Photo_unpaid:0,
  Baptism_expenses:0,
  Wedding_expenses:0,
  Gamobaptisi_expenses:0,
  Photo_expenses:0,
  Employ_payments_expenses:0,
  Editor_payments_expenses:0,
  Printer_payments_expenses:0,
  monthlyIncome:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyPaymentsExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyEditorExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  monthlyPrinterExpenses:[0,0,0,0,0,0,0,0,0,0,0,0],
  Baptism_package_cost:0,
  Wedding_package_cost:0,
  Photo_package_cost:0,
};

// setting filter to current month and year
var today=new Date().toUTCString();
let yearFilter= new Date(today).getFullYear();
let monthFilter= new Date(today).getMonth();
document.querySelector("[name='yearFilter']").value=yearFilter;
document.querySelector("[name='monthFilter']").value=monthFilter+1;


