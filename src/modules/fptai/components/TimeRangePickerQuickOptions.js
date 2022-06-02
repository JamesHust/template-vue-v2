import moment from 'moment'

const thisGroup = [
    {
        i18n: 'today',
        value: 'today',
        range: () => ({
            from: moment().startOf('day').unix(),
            to: moment().unix()
        })
    },
    {
        i18n: 'thisWeek',
        value: 'thisWeek',
        range: () => ({
            from: moment().startOf('week').unix(),
            to: moment().unix()
        })
    },
    {
        i18n: 'thisMonth',
        value: 'thisMonth',
        range: () => ({
            from: moment().startOf('month').unix(),
            to: moment().unix()
        })
    },
    {
        i18n: 'thisYear',
        value: 'thisYear',
        range: () => ({
            from: moment().startOf('year').unix(),
            to: moment().unix()
        })
    }
]
const minute1 = 60
const minuteGroup = []
const minuteList = [5, 15, 30, 45]
for (let minute of minuteList) {
    minuteGroup.push({
        i18n: 'minute',
        amount: minute,
        value: minute + 'minute',
        range: () => ({
            from: moment().unix() - minute * minute1,
            to: moment().unix()
        })
    })
}

const hour1 = minute1 * 60
const hourGroup = []
const hourList = [1, 2, 6, 12]
for (let hour of hourList) {
    hourGroup.push({
        i18n: 'hour',
        amount: hour,
        value: hour + 'hour',
        range: () => ({
            from: moment().unix() - hour * hour1,
            to: moment().unix()
        })
    })
}

const day1 = hour1 * 24
const dayGroup = []
const dayList = [1, 3, 7, 14]
for (let day of dayList) {
    dayGroup.push({
        i18n: 'day',
        amount: day,
        value: day + 'day',
        range: () => ({
            from: moment().unix() - day * day1,
            to: moment().unix()
        })
    })
}

const month1 = day1 * 30
const monthGroup = []
const monthList = [1, 3, 6, 12]
for (let month of monthList) {
    monthGroup.push({
        i18n: 'month',
        amount: month,
        value: month + 'month',
        range: () => ({
            from: moment().unix() - month * month1,
            to: moment().unix()
        })
    })
}

export const optionList = [
    ...thisGroup,
    ...minuteGroup,
    ...hourGroup,
    ...dayGroup,
    ...monthGroup
]

export const optionGroup = {
    thisGroup,
    minuteGroup,
    hourGroup,
    dayGroup,
    monthGroup
}

export default optionGroup
