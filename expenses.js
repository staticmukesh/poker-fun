module.exports = function parse(data) {
    let expenses = data.expenses;
    let response = {
        users: {},
        games: 0
    };

    expenses.forEach(function(expense){
        // filter Games only
        if (expense.category.name != "Games" || expense.deleted_at != null) {
            return;
        }

        response.games++;

        let users = expense.users;
        users.forEach(function(user){
            if (user.user.first_name == "Banker" && response.users[user.user_id]) {
                console.log(expense.description +" " + user.net_balance);
            }
            if (response.users[user.user_id]) {
                let stored_user = response.users[user.user_id];
                let balance = parseNumber(user.net_balance);
                stored_user.balance += balance; 
            } else {
                let balance = parseNumber(user.net_balance);
                response.users[user.user_id] = {
                    full_name: parseString(user.user.first_name) + " " + parseString(user.user.last_name),
                    balance: balance
                };
            }
        });
    });

    // since games are even
    response.games /= 2;

    return response;
}

function parseString(value) {
    return (value == null) ? "" : value
}

function parseNumber(value) {
    return (value == null) ? 0 : parseFloat(value)
}