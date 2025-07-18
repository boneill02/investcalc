let user_begin = 0;
let user_end = 0;
let user_return = 0;

let nasdaq_begin = 0;
let nasdaq_end = 0;
let nasdaq_return = 0;

const result_less =
    "Your return is less than the index. Lengthen your investment time period to see if you can overcome the low/negative returns.";
const result_more = "Nice! You beat the Nasdaq!";
const result_negative =
    "Your return is negative! This is the downside of risk. Change your dates or lengthen your investment period to see what happens.";

const wrapper = document.getElementById("wrapper");
const inform = document.getElementById("inform");
const results = document.getElementById("results");

function numfmt(num) {
    return Intl.NumberFormat().format(parseFloat(num).toFixed(2));
}

function tryAgain() {
    wrapper.removeChild(results);
    wrapper.appendChild(inform);
}

function riskreturncalc() {
    /* find date indexes */
    let start_date_index;
    let end_date_index;
    for (let i = 0; i < monthly_data.length; i++) {
        if (document.getElementById("sdate").value === monthly_data[i][0]) {
            start_date_index = i;
        }
        if (document.getElementById("edate").value === monthly_data[i][0]) {
            end_date_index = i;
        }
    }

    if (start_date_index == undefined || end_date_index == undefined) {
        alert("Form must be fully completed");
        return;
    }
    if (start_date_index >= end_date_index) {
        alert("End date must be after start date");
        return;
    }

    user_begin = Number(document.getElementById("ubegin").value);

    const monthly_in = user_begin;

    const months = end_date_index - start_date_index;

    const start_data = monthly_data[start_date_index];
    const end_data = monthly_data[start_date_index];
    const total_invested = monthly_in * months;
    const value_by_month = [];
    const nasdaq_value_by_month = [];
    const labels = [];

    /* calculate cumulative shares */
    let shares_purchased = 0;
    let cumulative_shares = 0;
    for (let i = start_date_index; i <= end_date_index; i++) {
        shares_purchased = monthly_in / monthly_data[i][1];
        cumulative_shares += shares_purchased;
        value_by_month.push(cumulative_shares * monthly_data[i][1]);
        nasdaq_value_by_month.push(monthly_data[i][2]);

        /* for chart */
        labels.push(monthly_data[i][0]);
    }

    user_end = cumulative_shares * monthly_data[end_date_index][1];
    user_return = RATE(months, monthly_in * -1, 0, user_end) * 12;

    nasdaq_begin = monthly_data[start_date_index][2];
    nasdaq_end = monthly_data[end_date_index][2];
    nasdaq_return = RATE(months, 0, nasdaq_begin * -1, nasdaq_end) * 12;

    /* display results */
    wrapper.removeChild(inform);
    wrapper.appendChild(results);

    document.getElementById("user_invested").innerHTML =
        "$" + numfmt(monthly_in * months);
    document.getElementById("user_end").innerHTML = "$" + numfmt(user_end, 2);
    document.getElementById("user_return").innerHTML =
        numfmt(user_return * 100, 2) + "%";
    document.getElementById("nasdaq_begin").innerHTML =
        "$" + numfmt(nasdaq_begin, 2);
    document.getElementById("nasdaq_end").innerHTML =
        "$" + numfmt(nasdaq_end, 2);
    document.getElementById("nasdaq_return").innerHTML =
        numfmt(nasdaq_return * 100, 2) + "%";

    if (user_return > nasdaq_return && user_return > 0) {
        document.getElementById("message").innerHTML = result_more;
    } else if (user_return < nasdaq_return && user_return > 0) {
        document.getElementById("message").innerHTML = result_less;
    } else {
        document.getElementById("message").innerHTML = result_negative;
    }

    /* make chart */
    const old_graph = document.getElementById("graph");
    if (old_graph != null) {
        results.removeChild(old_graph);
    }

    const ctx = document.createElement("canvas");
    results.appendChild(ctx);
    ctx.id = "graph";
    ctx.width = 400;
    ctx.height = 400;
    const data = {
        labels: labels,
        datasets: [
            {
                axis: "y",
                label: "User Value",
                data: value_by_month,
                fill: false,
                backgroundColor: ["rgba(255, 255, 132, 0.2)"],
                borderColor: ["rgb(200, 0, 200)"],
                borderWidth: 2,
                yAxisID: "user_value",
            },
            {
                axis: "y",
                label: "NASDAQ Value",
                data: nasdaq_value_by_month,
                fill: false,
                backgroundColor: ["rgba(75, 192, 192, 0.2)"],
                borderColor: ["rgb(200, 0, 10)"],
                borderWidth: 2,
                yAxisID: "nasdaq_value",
            },
        ],
    };

    const graph = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
            scales: {
                user_value: {
                    type: "linear",
                    position: "left",
                },
                nasdaq_value: {
                    type: "linear",
                    position: "right",
                },
            },
        },
    });
}

wrapper.removeChild(results);
