// financial dashboard: data fetching, totals, monthly tables, associate analytics

document.querySelector("#dashboard").addEventListener("click",function(){
  document.querySelector("#PageTag").textContent = "ΟΙΚΟΝΟΜΙΚΑ";
  document.querySelector("#bt-menu a.bt-menu-trigger").click(); //closemenu
  show_hide_date_filter(0);//hide filter
  var loaderHtml=document.querySelector(".job-container");
  loaderHtml.innerHTML=`
  <div class="loader-container">
    <div class="loader">
      <div class="loader-wheel"></div>
      <div class="loader-text"></div>
    </div>
  </div>
  `
  getDashboardData(new Date(new Date().toUTCString()).getFullYear())});

  function makeDashboard(year){

    var container = document.querySelector(".job-container");
    container.innerHTML = "";// remove cards if they exist
  
    var today=new Date().toUTCString();
    
    var formated_date=new Date(today).getDate().toString()+'/'+(new Date(today).getMonth()+1).toString()+'/'+new Date(today).getFullYear().toString();
    var dashboard=document.querySelector(".job-container");
    var default_filter_year=year;
    dashboard.innerHTML+=`
    <div class="dashboard-container">
              <div class="Dashboard-filter-container">
                  <div class="Dashboard-filter-wrapper">
                    <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
                    <div class="Dashboard-filter-button-container">
                      <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
                    </div>
                  </div>
                  <input id="employee-analytics" type="button" value="Αναλυτικά Συνεργατών">
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έσοδα-Έξοδα-Εκρεμότητες</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th> <th>ΠΟΣΟ</th></tr>
                       <tr> <td>ΕΣΟΔΑ</td> <td>${myDashboard.Baptism_payments+myDashboard.Wedding_payments+myDashboard.Gamobaptisi_payments+myDashboard.Photo_payments}</td></tr>
                       <tr> <td>ΕΚΚΡΕΜΟΤΗΤΕΣ</td><td>${myDashboard.Baptism_unpaid+myDashboard.Wedding_unpaid+myDashboard.Gamobaptisi_unpaid+myDashboard.Photo_unpaid}</td></tr>
                       <tr> <td>ΕΞΟΔΑ</td> <td>${myDashboard.Baptism_expenses+myDashboard.Wedding_expenses+myDashboard.Gamobaptisi_expenses+myDashboard.Photo_expenses}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="overview-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Εργασίες ανά Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΑΡΙΘΜΟΣ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_number}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_number}</td></tr>
                       <tr> <td>Γαμοβαπτίσεις</td><td>${myDashboard.Gamobaptisi_number}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_number}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="jobs-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έσοδα ανά Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΠΟΣΟ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_total_income}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_total_income}</td></tr>
                       <tr> <td>Γαμοβαπτίσεις</td><td>${myDashboard.Gamobaptisi_total_income}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_total_income}</td></tr>                    
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="income-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Έξοδα ανα Κατηγορία</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <th>ΤΥΠΟΣ</th><th>ΠΟΣΟ</th></tr>
                       <tr> <td>Γάμοι</td><td>${myDashboard.Wedding_expenses}</td></tr>
                       <tr> <td>Βαπτίσεις</td><td>${myDashboard.Baptism_expenses}</td></tr>
                       <tr> <td>Γαμοβαπτίσεις</td><td>${myDashboard.Gamobaptisi_expenses}</td></tr>
                       <tr> <td>Άλλο</td><td>${myDashboard.Photo_expenses}</td></tr>                   
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="expenses-per-category-chart"></canvas></div>
              </div>
              <div class="dashboard-section">
                  <h2 class="overview">Τύπος Εξόδων</h2>
                  <div class="table-container">
                    <table class="overview-table">
                      <tr> <th>ΤΥΠΟΣ</th> <th>ΠΟΣΟ</th></tr>
                       <tr> <td>Μεροκάματα</td> <td>${myDashboard.Employ_payments_expenses}</td></tr>
                       <tr> <td>Μοντάζ</td><td>${myDashboard.Editor_payments_expenses}</td></tr>
                       <tr> <td>Εκτυπώσεις</td><td>${myDashboard.Printer_payments_expenses}</td></tr>
                    </table>
                  </div>
                  <div class="graph-container"><canvas id="expenses-per-type-chart"></canvas></div>
              </div>
              
              <div class="dashboard-section big-table">
                  <h2 class="overview">Αναλυτικός Πίνακας<button id="dashboard_table_print"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
  </svg></button></h2>
                  <div class="table-container">
                    <table class="overview-table" id="printable-table">
                       <tr> <td>${formated_date}</td> <th>Αριθμός</th><th>Έσοδα</th><th>Εκκρεμότητες</th><th>Έξοδα</th></tr>
                       <tr> <th>Γάμοι</th> <td>${myDashboard.Wedding_number}</td><td>${myDashboard.Wedding_payments}</td><td>${myDashboard.Wedding_unpaid}</td><td>${myDashboard.Wedding_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Βαπτίσεις</th> <td>${myDashboard.Baptism_number}</td><td>${myDashboard.Baptism_payments}</td><td>${myDashboard.Baptism_unpaid}</td><td>${myDashboard.Baptism_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Γαμοβαπτίσεις</th> <td>${myDashboard.Gamobaptisi_number}</td><td>${myDashboard.Gamobaptisi_payments}</td><td>${myDashboard.Gamobaptisi_unpaid}</td><td>${myDashboard.Gamobaptisi_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Άλλο</th> <td>${myDashboard.Photo_number}</td><td>${myDashboard.Photo_payments}</td><td>${myDashboard.Photo_unpaid}</td><td>${myDashboard.Photo_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr> 
                       <tr> <th>Σύνολο</th> <td>${myDashboard.Wedding_number+myDashboard.Baptism_number+myDashboard.Gamobaptisi_number+myDashboard.Photo_number}</td><td>${myDashboard.Wedding_payments+myDashboard.Baptism_payments+myDashboard.Gamobaptisi_payments+myDashboard.Photo_payments}</td><td>${myDashboard.Wedding_unpaid+myDashboard.Baptism_unpaid+myDashboard.Gamobaptisi_unpaid+myDashboard.Photo_unpaid}</td><td>${myDashboard.Wedding_expenses+myDashboard.Baptism_expenses+myDashboard.Gamobaptisi_expenses+myDashboard.Photo_expenses}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td></tr>                
                    </table>
                  </div>
    </div>
     <div class="dashboard-section big-table" id="income-expenses-per-month">
                  <h2 class="overview"> Έσοδα-Έξοδα ανα Μήνα</h2>
                  <div class="graph-container"><canvas id="income-expenses-per-month-chart"></canvas></div>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                       <tr> <th>Έσοδα</th> <td>${myDashboard.monthlyIncome[0]}</td><td>${myDashboard.monthlyIncome[1]}</td><td>${myDashboard.monthlyIncome[2]}</td><td>${myDashboard.monthlyIncome[3]}</td><td>${myDashboard.monthlyIncome[4]}</td><td>${myDashboard.monthlyIncome[5]}</td><td>${myDashboard.monthlyIncome[6]}</td><td>${myDashboard.monthlyIncome[7]}</td><td>${myDashboard.monthlyIncome[8]}</td><td>${myDashboard.monthlyIncome[9]}</td><td>${myDashboard.monthlyIncome[10]}</td><td>${myDashboard.monthlyIncome[11]}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Έξοδα</th> <td>${myDashboard.monthlyExpenses[0]}</td><td>${myDashboard.monthlyExpenses[1]}</td><td>${myDashboard.monthlyExpenses[2]}</td><td>${myDashboard.monthlyExpenses[3]}</td><td>${myDashboard.monthlyExpenses[4]}</td><td>${myDashboard.monthlyExpenses[5]}</td><td>${myDashboard.monthlyExpenses[6]}</td><td>${myDashboard.monthlyExpenses[7]}</td><td>${myDashboard.monthlyExpenses[8]}</td><td>${myDashboard.monthlyExpenses[9]}</td><td>${myDashboard.monthlyExpenses[10]}</td><td>${myDashboard.monthlyExpenses[11]}</td></tr>                
                    </table>
                  </div>
                  <input id="expenses-per-month-and-category" type="button" value="Έξοδα ανα Κατηγορία και Μήνα">
              </div>
    `
    document.querySelector("#expenses-per-month-and-category").addEventListener("click",function(){
      var filter_year=document.querySelector("#DashboardFilter").value;
      fetch_batch_2(filter_year)});
  
    document.querySelector("#employee-analytics").addEventListener("click",function(){
      var associateSelection="";
  
      for(associate of MyAssociates){
        associateSelection+=`<option value=${associate.id}>${associate.firstname} ${associate.surname}</option>`;
      }
      var dashboard_filter=document.querySelector(".job-container");
      dashboard_filter.innerHTML=`
      <div class="dashboard-container">
        <div class="Dashboard-filter-container">
          <div class="Dashboard-filter-wrapper">
            <div class="selection-container">
              <div class="custom-select">
                  <select name="associate">
                  <option value="" selected="selected"> ΕΠΙΛΟΓΗ</option>
                  ${associateSelection}
                  </select>
              </div>
            </div> 
            <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
            <div class="Dashboard-filter-button-container">
              <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
            </div>
          </div>
        </div>         
      </div>
      `;

      document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
        let selection=document.querySelector(" .Dashboard-filter-container [name='associate']");
        let associate_id=selection.value;
        let associate_name=selection.options[selection.selectedIndex].text;
        let year=document.querySelector("#DashboardFilter").value;
        var Html=document.querySelector(".dashboard-container");
        let loaderHtml=`
          <div class="loader-container">
            <div class="loader">
              <div class="loader-wheel"></div>
              <div class="loader-text"></div>
            </div>
          </div>
        `;
        Html.insertAdjacentHTML("beforeend",loaderHtml);
        getAssociateAnalitics(associate_id,year,associate_name);
      }); 
      //getDashboardData(new Date(new Date().toUTCString()).getFullYear());
    });

    document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
      let year=document.querySelector("#DashboardFilter").value;
      var loaderHtml=document.querySelector(".job-container");
      loaderHtml.innerHTML=`
      <div class="loader-container">
        <div class="loader">
          <div class="loader-wheel"></div>
          <div class="loader-text"></div>
        </div>
      </div>
      `;
      getDashboardData(year);
    });
    make_overview_chart([myDashboard.Baptism_payments+myDashboard.Wedding_payments+myDashboard.Gamobaptisi_payments+myDashboard.Photo_payments,
      myDashboard.Baptism_unpaid+myDashboard.Wedding_unpaid+myDashboard.Gamobaptisi_unpaid+myDashboard.Photo_unpaid,
      myDashboard.Baptism_expenses+myDashboard.Wedding_expenses+myDashboard.Gamobaptisi_expenses+myDashboard.Photo_expenses,
    ]);
    make_jobs_per_category_chart([myDashboard.Wedding_number,myDashboard.Baptism_number,myDashboard.Gamobaptisi_number,myDashboard.Photo_number]);
    make_income_per_category_chart([myDashboard.Wedding_total_income,myDashboard.Baptism_total_income,myDashboard.Gamobaptisi_total_income,myDashboard.Photo_total_income]);
    make_expenses_per_category_chart([myDashboard.Wedding_expenses,myDashboard.Baptism_expenses,myDashboard.Gamobaptisi_expenses,myDashboard.Photo_expenses]);
    make_expenses_per_type_chart([myDashboard.Employ_payments_expenses,myDashboard.Editor_payments_expenses,myDashboard.Printer_payments_expenses])
    make_montly_income_expenses_chart(myDashboard.monthlyIncome,myDashboard.monthlyExpenses);

    document.querySelector("#dashboard_table_print").addEventListener('click',function (){
        var table= document.querySelector("#printable-table");
        var today=new Date().toUTCString();
        var formated_date=new Date(today).getDate().toString()+'_'+(new Date(today).getMonth()+1).toString()+'_'+new Date(today).getFullYear().toString();
        var opt = {
          pagebreak: { mode: ['css'] },
          margin:       1,
          filename:     'Isologismos_'+formated_date+'.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'cm', format: 'a4', orientation: 'l' }
        };
        
        html2pdf().set(opt).from(table).save();
    })
  }  

    function makeAssociateDashboard(year,monthlyData,associate_name){
      
      var dashboard=document.querySelector(".job-container");
      var default_filter_year=year;
      var associateSelection="";
  
      for(associate of MyAssociates){
        associateSelection+=`<option value=${associate.id}>${associate.firstname} ${associate.surname}</option>`;
      }
      let TotalMontlyPayment=[sumMontlyPaymets(monthlyData,0),sumMontlyPaymets(monthlyData,1),sumMontlyPaymets(monthlyData,2),sumMontlyPaymets(monthlyData,3),sumMontlyPaymets(monthlyData,4),sumMontlyPaymets(monthlyData,5),sumMontlyPaymets(monthlyData,6),sumMontlyPaymets(monthlyData,7),sumMontlyPaymets(monthlyData,8),sumMontlyPaymets(monthlyData,9),sumMontlyPaymets(monthlyData,10),sumMontlyPaymets(monthlyData,11)];
      let TotalRolePayments=[sumRolePayments(monthlyData.monthlyPhotographer1),sumRolePayments(monthlyData.monthlyPhotographer2),sumRolePayments(monthlyData.monthlyVideographer1),sumRolePayments(monthlyData.monthlyVideographer2),sumRolePayments(monthlyData.monthlyEditor),sumRolePayments(monthlyData.monthlyDrone),sumRolePayments(monthlyData.monthlyAlbums)];
      let allPayments=TotalRolePayments.reduce((a, b) => a + b, 0);
      dashboard.innerHTML=`
      <div class="dashboard-container">
        <div class="Dashboard-filter-container">
          <div class="Dashboard-filter-wrapper">
            <div class="selection-container">
              <div class="custom-select">
                  <select name="associate">
                  <option value="" selected="selected"> ΕΠΙΛΟΓΗ</option>
                  ${associateSelection}
                  </select>
              </div>
            </div> 
            <input type="number" id="DashboardFilter" name="DashboardFilter" min="2004" max="2060"  value="${default_filter_year}">
            <div class="Dashboard-filter-button-container">
              <img src="images/down_arrow.png" class="DashboardfilterButton"></img>
            </div>
          </div>
        </div>    
        <div class="dashboard-section big-table">
            <h2 class="overview">Πληρωμές ${associate_name}</h2>
            <div class="table-container">
              <table class="overview-table">
                  <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 1</th> <td>${monthlyData.monthlyPhotographer1[0]}</td><td>${monthlyData.monthlyPhotographer1[1]}</td><td>${monthlyData.monthlyPhotographer1[2]}</td><td>${monthlyData.monthlyPhotographer1[3]}</td><td>${monthlyData.monthlyPhotographer1[4]}</td><td>${monthlyData.monthlyPhotographer1[5]}</td><td>${monthlyData.monthlyPhotographer1[6]}</td><td>${monthlyData.monthlyPhotographer1[7]}</td><td>${monthlyData.monthlyPhotographer1[8]}</td><td>${monthlyData.monthlyPhotographer1[9]}</td><td>${monthlyData.monthlyPhotographer1[10]}</td><td>${monthlyData.monthlyPhotographer1[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 2</th> <td>${monthlyData.monthlyPhotographer2[0]}</td><td>${monthlyData.monthlyPhotographer2[1]}</td><td>${monthlyData.monthlyPhotographer2[2]}</td><td>${monthlyData.monthlyPhotographer2[3]}</td><td>${monthlyData.monthlyPhotographer2[4]}</td><td>${monthlyData.monthlyPhotographer2[5]}</td><td>${monthlyData.monthlyPhotographer2[6]}</td><td>${monthlyData.monthlyPhotographer2[7]}</td><td>${monthlyData.monthlyPhotographer2[8]}</td><td>${monthlyData.monthlyPhotographer2[9]}</td><td>${monthlyData.monthlyPhotographer2[10]}</td><td>${monthlyData.monthlyPhotographer2[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 1</th> <td>${monthlyData.monthlyVideographer1[0]}</td><td>${monthlyData.monthlyVideographer1[1]}</td><td>${monthlyData.monthlyVideographer1[2]}</td><td>${monthlyData.monthlyVideographer1[3]}</td><td>${monthlyData.monthlyVideographer1[4]}</td><td>${monthlyData.monthlyVideographer1[5]}</td><td>${monthlyData.monthlyVideographer1[6]}</td><td>${monthlyData.monthlyVideographer1[7]}</td><td>${monthlyData.monthlyVideographer1[8]}</td><td>${monthlyData.monthlyVideographer1[9]}</td><td>${monthlyData.monthlyVideographer1[10]}</td><td>${monthlyData.monthlyVideographer1[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 2</th> <td>${monthlyData.monthlyVideographer2[0]}</td><td>${monthlyData.monthlyVideographer2[1]}</td><td>${monthlyData.monthlyVideographer2[2]}</td><td>${monthlyData.monthlyVideographer2[3]}</td><td>${monthlyData.monthlyVideographer2[4]}</td><td>${monthlyData.monthlyVideographer2[5]}</td><td>${monthlyData.monthlyVideographer2[6]}</td><td>${monthlyData.monthlyVideographer2[7]}</td><td>${monthlyData.monthlyVideographer2[8]}</td><td>${monthlyData.monthlyVideographer2[9]}</td><td>${monthlyData.monthlyVideographer2[10]}</td><td>${monthlyData.monthlyVideographer2[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΜΟΝΤΑΖ</th> <td>${monthlyData.monthlyEditor[0]}</td><td>${monthlyData.monthlyEditor[1]}</td><td>${monthlyData.monthlyEditor[2]}</td><td>${monthlyData.monthlyEditor[3]}</td><td>${monthlyData.monthlyEditor[4]}</td><td>${monthlyData.monthlyEditor[5]}</td><td>${monthlyData.monthlyEditor[6]}</td><td>${monthlyData.monthlyEditor[7]}</td><td>${monthlyData.monthlyEditor[8]}</td><td>${monthlyData.monthlyEditor[9]}</td><td>${monthlyData.monthlyEditor[10]}</td><td>${monthlyData.monthlyEditor[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>Drone</th> <td>${monthlyData.monthlyDrone[0]}</td><td>${monthlyData.monthlyDrone[1]}</td><td>${monthlyData.monthlyDrone[2]}</td><td>${monthlyData.monthlyDrone[3]}</td><td>${monthlyData.monthlyDrone[4]}</td><td>${monthlyData.monthlyDrone[5]}</td><td>${monthlyData.monthlyDrone[6]}</td><td>${monthlyData.monthlyDrone[7]}</td><td>${monthlyData.monthlyDrone[8]}</td><td>${monthlyData.monthlyDrone[9]}</td><td>${monthlyData.monthlyDrone[10]}</td><td>${monthlyData.monthlyDrone[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΕΚΤΥΠΩΣΕΙΣ</th> <td>${monthlyData.monthlyAlbums[0]}</td><td>${monthlyData.monthlyAlbums[1]}</td><td>${monthlyData.monthlyAlbums[2]}</td><td>${monthlyData.monthlyAlbums[3]}</td><td>${monthlyData.monthlyAlbums[4]}</td><td>${monthlyData.monthlyAlbums[5]}</td><td>${monthlyData.monthlyAlbums[6]}</td><td>${monthlyData.monthlyAlbums[7]}</td><td>${monthlyData.monthlyAlbums[8]}</td><td>${monthlyData.monthlyAlbums[9]}</td><td>${monthlyData.monthlyAlbums[10]}</td><td>${monthlyData.monthlyAlbums[11]}</td></tr>
                  <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr> <th>ΣΥΝΟΛΙΚΑ</th> <td>${TotalMontlyPayment[0]}</td><td>${TotalMontlyPayment[1]}</td><td>${TotalMontlyPayment[2]}</td><td>${TotalMontlyPayment[3]}</td><td>${TotalMontlyPayment[4]}</td><td>${TotalMontlyPayment[5]}</td><td>${TotalMontlyPayment[6]}</td><td>${TotalMontlyPayment[7]}</td><td>${TotalMontlyPayment[8]}</td><td>${TotalMontlyPayment[9]}</td><td>${TotalMontlyPayment[10]}</td><td>${TotalMontlyPayment[11]}</td></tr>
                </table>

            </div>
            <div class="table-container">
              <table class="associate-role-payments-table">
                  <tr> <td>Ετήσια Ανα Κατηγορία</td> <th>ΣΥΝΟΛΙΚΑ</th></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 1</th> <td>${TotalRolePayments[0]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΦΩΤΟΓΡΑΦΟΣ 2</th> <td>${TotalRolePayments[1]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 1</th> <td>${TotalRolePayments[2]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΒΙΝΤΕΟΓΡΑΦΟΣ 2</th> <td>${TotalRolePayments[3]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΜΟΝΤΑΖ</th> <td>${TotalRolePayments[4]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>Drone</th> <td>${TotalRolePayments[5]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΕΚΤΥΠΩΣΕΙΣ</th> <td>${TotalRolePayments[6]}</td></tr>
                  <tr> <td></td> <td></td></tr>
                  <tr> <th>ΣΥΝΟΛΙΚΕΣ ΠΛΗΡΩΜΕΣ ΣΥΝΕΡΓΑΤΗ</th> <td>${allPayments}</td></tr>
                </table>
            </div>
        </div>   
      </div>
      `
  
      document.querySelector(".DashboardfilterButton").addEventListener("click",function (){
          let selection=document.querySelector(" .Dashboard-filter-container [name='associate']");
          let associate_id=selection.value;
          let associate_name=selection.options[selection.selectedIndex].text;
          let year=document.querySelector("#DashboardFilter").value;
          var loaderHtml=document.querySelector(".job-container");
          loaderHtml.innerHTML=`
          <div class="loader-container">
            <div class="loader">
              <div class="loader-wheel"></div>
              <div class="loader-text"></div>
            </div>
          </div>
          `;
          getAssociateAnalitics(associate_id,year,associate_name);
        });
      }

  function makeMonthlyExpensesDashboardTable(year){
    let button=document.querySelector("#expenses-per-month-and-category");
    button.remove();
    let anHTML=`<h2 class="overview"> Έξοδα ανα Κατηγορία και Μήνα</h2>
                  <div class="table-container">
                    <table class="overview-table">
                       <tr> <td></td> <th>Ιαν</th><th>Φεβ</th><th>Μαρ</th><th>Απρ</th><th>Μάι</th><th>Ιούν</th><th>Ιούλ</th><th>Αυγ</th><th>Σεπ</th><th>Οκτ</th><th>Νοέ</th><th>Δεκ</th></tr>
                       <tr> <th>Mεροκάματα</th> <td>${myDashboard.monthlyPaymentsExpenses[0]}</td><td>${myDashboard.monthlyPaymentsExpenses[1]}</td><td>${myDashboard.monthlyPaymentsExpenses[2]}</td><td>${myDashboard.monthlyPaymentsExpenses[3]}</td><td>${myDashboard.monthlyPaymentsExpenses[4]}</td><td>${myDashboard.monthlyPaymentsExpenses[5]}</td><td>${myDashboard.monthlyPaymentsExpenses[6]}</td><td>${myDashboard.monthlyPaymentsExpenses[7]}</td><td>${myDashboard.monthlyPaymentsExpenses[8]}</td><td>${myDashboard.monthlyPaymentsExpenses[9]}</td><td>${myDashboard.monthlyPaymentsExpenses[10]}</td><td>${myDashboard.monthlyPaymentsExpenses[11]}</td></tr>
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Μοντάζ</th> <td>${myDashboard.monthlyEditorExpenses[0]}</td><td>${myDashboard.monthlyEditorExpenses[1]}</td><td>${myDashboard.monthlyEditorExpenses[2]}</td><td>${myDashboard.monthlyEditorExpenses[3]}</td><td>${myDashboard.monthlyEditorExpenses[4]}</td><td>${myDashboard.monthlyEditorExpenses[5]}</td><td>${myDashboard.monthlyEditorExpenses[6]}</td><td>${myDashboard.monthlyEditorExpenses[7]}</td><td>${myDashboard.monthlyEditorExpenses[8]}</td><td>${myDashboard.monthlyEditorExpenses[9]}</td><td>${myDashboard.monthlyEditorExpenses[10]}</td><td>${myDashboard.monthlyEditorExpenses[11]}</td></tr>                
                       <tr> <td></td> <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                       <tr> <th>Εκτυπώσεις</th> <td>${myDashboard.monthlyPrinterExpenses[0]}</td><td>${myDashboard.monthlyPrinterExpenses[1]}</td><td>${myDashboard.monthlyPrinterExpenses[2]}</td><td>${myDashboard.monthlyPrinterExpenses[3]}</td><td>${myDashboard.monthlyPrinterExpenses[4]}</td><td>${myDashboard.monthlyPrinterExpenses[5]}</td><td>${myDashboard.monthlyPrinterExpenses[6]}</td><td>${myDashboard.monthlyPrinterExpenses[7]}</td><td>${myDashboard.monthlyPrinterExpenses[8]}</td><td>${myDashboard.monthlyPrinterExpenses[9]}</td><td>${myDashboard.monthlyPrinterExpenses[10]}</td><td>${myDashboard.monthlyPrinterExpenses[11]}</td></tr>                                   
                    </table>  
                  </div>`;
    let section=document.querySelector("#income-expenses-per-month");
    section.insertAdjacentHTML("beforeend",anHTML);
  }

function getDashboardData(filter_year){
  const year=filter_year;
  Promise.all([

    fetch("/api/dashboard/jobCount/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/jobCount/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/jobCount/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"fotografisi,"+year, { method: "GET" }),

    fetch("/api/dashboard/ExpensesPerCategory/"+"baptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerCategory/"+"gamos,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerCategory/"+"fotografisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/EmployPayments/"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/EditorPayments/"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerType/PrinterPayments/"+year, { method: "GET" }),

    fetch("/api/dashboard/monthlyIncome/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyIncome/"+"12,"+year, { method: "GET" }),

    fetch("/api/dashboard/monthlyExpenses/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyExpenses/"+"12,"+year, { method: "GET" }),

    fetch("/api/dashboard/jobCount/"+"gamobaptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/IncomePerCategory/"+"gamobaptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/PaymentsPerCategory/"+"gamobaptisi,"+year, { method: "GET" }),
    fetch("/api/dashboard/ExpensesPerCategory/"+"gamobaptisi,"+year, { method: "GET" }),
])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  
  // 2 indexes because response is now an array of arrays containing json data
  myDashboard.Baptism_number=response[0][0].job_count;
  myDashboard.Wedding_number=response[1][0].job_count;
  myDashboard.Photo_number=response[2][0].job_count;
  myDashboard.Baptism_total_income=response[3][0].incomeTotal;
  myDashboard.Wedding_total_income=response[4][0].incomeTotal;
  myDashboard.Photo_total_income=response[5][0].incomeTotal;
  myDashboard.Baptism_payments=response[6][0].paymentTotal;
  myDashboard.Wedding_payments=response[7][0].paymentTotal;
  myDashboard.Photo_payments=response[8][0].paymentTotal;

  myDashboard.Baptism_unpaid=myDashboard.Baptism_total_income-myDashboard.Baptism_payments;
  myDashboard.Wedding_unpaid=myDashboard.Wedding_total_income-myDashboard.Wedding_payments;
  myDashboard.Photo_unpaid=myDashboard.Photo_total_income-myDashboard.Photo_payments;

  myDashboard.Baptism_expenses=response[9][0].Expenses;
  myDashboard.Wedding_expenses=response[10][0].Expenses;
  myDashboard.Photo_expenses=response[11][0].Expenses;
  myDashboard.Employ_payments_expenses=response[12][0].Expenses;
  myDashboard.Editor_payments_expenses=response[13][0].Expenses;
  myDashboard.Printer_payments_expenses=response[14][0].Expenses;

  myDashboard.monthlyIncome[0]=response[15][0].MonthlyIncome;
  myDashboard.monthlyIncome[1]=response[16][0].MonthlyIncome;
  myDashboard.monthlyIncome[2]=response[17][0].MonthlyIncome;
  myDashboard.monthlyIncome[3]=response[18][0].MonthlyIncome;
  myDashboard.monthlyIncome[4]=response[19][0].MonthlyIncome;
  myDashboard.monthlyIncome[5]=response[20][0].MonthlyIncome;
  myDashboard.monthlyIncome[6]=response[21][0].MonthlyIncome;
  myDashboard.monthlyIncome[7]=response[22][0].MonthlyIncome;
  myDashboard.monthlyIncome[8]=response[23][0].MonthlyIncome;
  myDashboard.monthlyIncome[9]=response[24][0].MonthlyIncome;
  myDashboard.monthlyIncome[10]=response[25][0].MonthlyIncome;
  myDashboard.monthlyIncome[11]=response[26][0].MonthlyIncome;
  
  myDashboard.monthlyExpenses[0]=response[27][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[1]=response[28][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[2]=response[29][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[3]=response[30][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[4]=response[31][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[5]=response[32][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[6]=response[33][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[7]=response[34][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[8]=response[35][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[9]=response[36][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[10]=response[37][0].MonthlyExpenses;
  myDashboard.monthlyExpenses[11]=response[38][0].MonthlyExpenses;

  myDashboard.Gamobaptisi_number=response[39][0].job_count;
  myDashboard.Gamobaptisi_total_income=response[40][0].incomeTotal;
  myDashboard.Gamobaptisi_payments=response[41][0].paymentTotal;
  myDashboard.Gamobaptisi_unpaid=myDashboard.Gamobaptisi_total_income-myDashboard.Gamobaptisi_payments;
  myDashboard.Gamobaptisi_expenses=response[42][0].Expenses;


  console.log(myDashboard);
})
  .then(()=>{makeDashboard(year)})
}

function fetch_batch_2(year){
    Promise.all([

    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"1,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"2,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"3,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"4,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"5,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"6,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"7,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"8,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"9,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"10,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"11,"+year, { method: "GET" }),
    fetch("/api/dashboard/monthlyPaymentsExpenses/"+"12,"+year, { method: "GET" }),

      fetch("/api/dashboard/monthlyEditorExpenses/"+"1,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"2,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"3,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"4,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"5,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"6,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"7,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"8,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"9,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"10,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"11,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyEditorExpenses/"+"12,"+year, { method: "GET" }),

      fetch("/api/dashboard/monthlyPrinterExpenses/"+"1,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"2,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"3,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"4,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"5,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"6,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"7,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"8,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"9,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"10,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"11,"+year, { method: "GET" }),
      fetch("/api/dashboard/monthlyPrinterExpenses/"+"12,"+year, { method: "GET" }), 
    ])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  
  myDashboard.monthlyPaymentsExpenses[0]=response[0][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[1]=response[1][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[2]=response[2][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[3]=response[3][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[4]=response[4][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[5]=response[5][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[6]=response[6][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[7]=response[7][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[8]=response[8][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[9]=response[9][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[10]=response[10][0].monthlyPaymentsExpenses;
  myDashboard.monthlyPaymentsExpenses[11]=response[11][0].monthlyPaymentsExpenses;

  myDashboard.monthlyEditorExpenses[0]=response[12][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[1]=response[13][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[2]=response[14][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[3]=response[15][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[4]=response[16][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[5]=response[17][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[6]=response[18][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[7]=response[19][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[8]=response[20][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[9]=response[21][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[10]=response[22][0].monthlyEditorExpenses;
  myDashboard.monthlyEditorExpenses[11]=response[23][0].monthlyEditorExpenses;

  myDashboard.monthlyPrinterExpenses[0]=response[24][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[1]=response[25][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[2]=response[26][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[3]=response[27][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[4]=response[28][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[5]=response[29][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[6]=response[30][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[7]=response[31][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[8]=response[32][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[9]=response[33][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[10]=response[34][0].monthlyPrinterExpenses;
  myDashboard.monthlyPrinterExpenses[11]=response[35][0].monthlyPrinterExpenses;
  console.log(myDashboard);
  })
  .then(()=>{makeMonthlyExpensesDashboardTable(year)})
}


function getAssociateAnalitics(id,filter_year,name){
  const year=filter_year;
  var array={};
  const associate_name=name;
  Promise.all([
    fetch("/api/associateAnalytics/monthlyPayments/"+"1,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"2,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"3,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"4,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"5,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"6,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"7,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"8,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"9,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"10,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"11,"+year+","+id, { method: "GET" }),
    fetch("/api/associateAnalytics/monthlyPayments/"+"12,"+year+","+id, { method: "GET" })
])
.then(response => Promise.all(response.map(r => r.json())))
.then(response => {
  console.log(response);
  let albums=[];
  let drone=[];
  let editor=[];
  let photographer1=[];
  let photographer2=[];
  let videographer1=[];
  let videographer2=[];
  for(let i=0;i<12;i++){
    albums[i]=response[i][0].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    drone[i]=response[i][1].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    editor[i]=response[i][2].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    photographer1[i]=response[i][3].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    photographer2[i]=response[i][4].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    videographer1[i]=response[i][5].AssociateMonthlyExpenses;
  }
  for(let i=0;i<12;i++){
    videographer2[i]=response[i][6].AssociateMonthlyExpenses;
  }

  array={
    monthlyAlbums:albums,
    monthlyDrone:drone,
    monthlyEditor:editor,
    monthlyPhotographer1:photographer1,
    monthlyPhotographer2:photographer2,
    monthlyVideographer1:videographer1,
    monthlyVideographer2:videographer2,        
  }
  console.log(array);
})
.then(()=>{makeAssociateDashboard(year,array,associate_name)})
}

function sumMontlyPaymets(data,month){
  let sum=data.monthlyPhotographer1[month]+data.monthlyPhotographer2[month]+data.monthlyVideographer1[month]+data.monthlyVideographer2[month]+data.monthlyEditor[month]+data.monthlyAlbums[month]+data.monthlyDrone[month];
  return sum;
}
function sumRolePayments(rolePayments){
  return rolePayments.reduce((a, b) => a + b, 0);  
}
