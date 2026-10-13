
function make_overview_chart(mydata){
  var chartid = document.querySelector('#overview-chart');

  new Chart(chartid, {
    type: 'doughnut',
    
    data: {
      labels: ['ΕΣΟΔΑ', 'ΕΚΚΡΕΜΟΥΝ', 'ΕΞΟΔΑ'],
      datasets: [{
        data: mydata,
        backgroundColor: [
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)'
        ],
        hoverOffset: 4
      }]
    }
  });
  };

  function make_income_per_category_chart(mydata){
    var chartid = document.querySelector('#income-per-category-chart');
  
    new Chart(chartid, {
      type: 'bar',
      data: {
        labels: ['ΓΑΜΟΣ', 'ΒΑΠΤΙΣΗ', 'ΑΛΛΟ'],
        datasets: [{
          data: mydata,
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(54, 162, 235)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 4
        }]
      },
      options:{
        scales: {
          x: {
            grid: {
              color: 'rgb(255, 255, 255)'
            },
            ticks: {
              color: 'rgb(255, 255, 255)'
            }
          },
          y: {
            grid: {
              color: 'rgb(255, 255, 255)'
            },
            ticks: {
              color: 'rgb(255, 255, 255)'
            }
          },
        },
        plugins:{
          legend: {
            display: false
        }
        }
      }
    });
    }

    function make_expenses_per_category_chart(mydata){
      var chartid = document.querySelector('#expenses-per-category-chart');
    
      new Chart(chartid, {
        type: 'bar',
        data: {
          labels: ['ΓΑΜΟΣ', 'ΒΑΠΤΙΣΗ', 'ΑΛΛΟ'],
          datasets: [{
            data: mydata,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 99, 132)',
              'rgb(255, 99, 132)'
            ],
            hoverOffset: 4
          }]
        },
        options:{
          scales: {
            x: {
              grid: {
                color: 'rgb(255, 255, 255)'
              },
              ticks: {
                color: 'rgb(255, 255, 255)'
              }
            },
            y: {
              grid: {
                color: 'rgb(255, 255, 255)'
              },
              ticks: {
                color: 'rgb(255, 255, 255)'
              }
            },
          },
          plugins:{
            legend: {
              display: false
          }
          }
        }
      });
      }

      function make_jobs_per_category_chart(mydata){
        var chartid = document.querySelector('#jobs-per-category-chart');
      
        new Chart(chartid, {
          type: 'bar',
          data: {
            labels: ['ΓΑΜΟΣ', 'ΒΑΠΤΙΣΗ', 'ΑΛΛΟ'],
            datasets: [{
              data: mydata,
              backgroundColor: [
                'rgb(123, 255, 86)',
                'rgb(123, 255, 86)',
                'rgb(123, 255, 86)',
              ],
              hoverOffset: 4
            }]
          },
          options:{
            scales: {
              x: {
                grid: {
                  color: 'rgb(255, 255, 255)'
                },
                ticks: {
                  color: 'rgb(255, 255, 255)'
                }
              },
              y: {
                grid: {
                  color: 'rgb(255, 255, 255)'
                },
                ticks: {
                  color: 'rgb(255, 255, 255)'
                }
              },
            },
            plugins:{
              legend: {
                display: false
            }
            }
          }
        });
        }

        function make_expenses_per_type_chart(mydata){
          var chartid = document.querySelector('#expenses-per-type-chart');
        
          new Chart(chartid, {
            type: 'bar',
            data: {
              labels: ['Μεροκάματα', 'Μοντάζ', 'Εκτυπώσεις'],
              datasets: [{
                data: mydata,
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 99, 132)',
                  'rgb(255, 99, 132)',
                ],
                hoverOffset: 4
              }]
            },
            options:{
              scales: {
                x: {
                  grid: {
                    color: 'rgb(255, 255, 255)'
                  },
                  ticks: {
                    color: 'rgb(255, 255, 255)'
                  }
                },
                y: {
                  grid: {
                    color: 'rgb(255, 255, 255)'
                  },
                  ticks: {
                    color: 'rgb(255, 255, 255)'
                  }
                },
              },
              plugins:{
                legend: {
                  display: false
              }
              }
            }
          });
          }

    function make_montly_income_expenses_chart(income,expenses){
      var chartid = document.querySelector('#income-expenses-per-month-chart');
    
      new Chart(chartid, {
        type: 'line',
        data: {
          labels: ['Ιαν', 'Φεβ','Μαρ','Απρ', 'Μάι', 'Ιουν','Ιουλ',  'Αυγ','Σεπ', 'Ωκτ','Νοε', 'Δεκ'],
          datasets: [{
            label:'Έσοδα',
            data: income,
            borderColor: [
              'rgb(54, 162, 235)',
            ],
            fill: false,
            tension: 0
          },
          {
            label:'Έξοδα',
            data: expenses,
            borderColor: [
              'rgb(255, 99, 132)'
            ],
            fill: false,
            tension: 0
          }
          

        ]},
        options:{
          scales: {
            x: {
              grid: {
                color: 'rgb(255, 255, 255)'
              },
              ticks: {
                color: 'rgb(255, 255, 255)'
              }
            },
            y: {
              grid: {
                color: 'rgb(255, 255, 255)'
              },
              ticks: {
                color: 'rgb(255, 255, 255)'
              }
            },
          }
        }
      });
      };