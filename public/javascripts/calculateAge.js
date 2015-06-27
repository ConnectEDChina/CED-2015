define(function () {
    return function (dateObj) {
        var todayDate = new Date();
        var todayYear = todayDate.getFullYear();
        var todayMonth = todayDate.getMonth();
        var todayDay = todayDate.getDate();

        var compareDate = dateObj;
        var birthYear = compareDate.getFullYear();
        var birthMonth = compareDate.getMonth();
        var birthDay = compareDate.getDate();

        var age = todayYear - birthYear; 

        if (todayMonth < birthMonth - 1)
        {
        age--;
        }

        if (birthMonth - 1 == todayMonth && todayDay < birthDay)
        {
        age--;
        }
        return age;
    };
});