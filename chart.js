function prepareForUser(user_id, data) {
    let expenses = data.expenses;
    let response = {
        user: {},
        points: {},
    };

    let unOrderedPoints = {};
    expenses.forEach(function(expense){
        if (filterExpense(expense)) {
            return;
        }

        let game = findGameNumber(expense.description)
        if (game == "") {
            return;
        }

        let bet = unOrderedPoints[game];
        if (bet == undefined) {
            bet = 0
        }

        expense.users.forEach(function(user){
            if (user.user_id == user_id) {
                response.user.full_name = parseString(user.user.first_name) + " " + parseString(user.user.last_name)
                bet = bet+ parseNumber(user.net_balance);
            }
        });

        unOrderedPoints[game] = bet
    });

    let points = {};
    Object.keys(unOrderedPoints).sort().forEach(function(key) {
        points[key] = unOrderedPoints[key];
    });

    response.points = points;

    return response;
}

function parseString(value) {
    return (value == null) ? "" : value
}

function parseNumber(value) {
    return (value == null) ? 0 : parseFloat(value)
}

function filterExpense(expense) {
    if (expense.category.name != "Games" ){
        return true
    }

    if (expense.deleted_at != null) {
        return true
    }

    return false
}

function findGameNumber(desc) {
    for (let field of desc.split(" ")){
        if (!isNaN(field)) {
            return field
        }
    }
    return ""
}

module.exports = {
    prepareForUser: prepareForUser,
}