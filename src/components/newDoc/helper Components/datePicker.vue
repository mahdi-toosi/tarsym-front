<template>
    <div class="date_time_picker_wrapper">
        <button @click="showPicker()">
            {{ showDateForOprator }}
            <span v-if="/[-]/.test(picked.year)">-</span>
            <!-- ه‍.ق -->
        </button>
        <span
            class="clearDate"
            v-if="picked.month != '00'"
            @click="$store.commit('docs/CLEAR_DATE')"
        >
            <i class="mdi mdi-close"></i>
        </span>
        <div class="date_time_picker" :class="displayPicker ? 'show' : ''">
            <header>
                <ul class="pages">
                    <li class="type" @click="changeType()">
                        {{ calendar.curentName }}
                    </li>
                    <li
                        class="year"
                        @click="changePage(picked.year ? 'years' : 'centurys')"
                    >
                        {{ picked.year ? picked.year : "سال" }}
                    </li>
                    <li class="month" @click="changePage('months')">
                        {{ curentMonthName }}
                    </li>
                </ul>
            </header>
            <div class="page_wrapper">
                <ul
                    class="centurys"
                    :class="[pages.centurys ? 'show_this_page' : '']"
                >
                    <li
                        v-for="(century, index) in centurys"
                        :key="index"
                        :class="century == picked.century ? 'selected' : ''"
                        @click="pickCentury(century)"
                    >
                        {{ century }}
                    </li>
                </ul>
                <ul
                    class="years"
                    :class="[pages.years ? 'show_this_page' : '']"
                >
                    <li @click="changePage('centurys')">
                        <i class="fas fa-chevron-right"></i>
                    </li>
                    <li
                        v-for="(year, index) in years"
                        :key="index"
                        :class="year == picked.year ? 'selected' : ''"
                        @click="pickYear(year)"
                    >
                        {{ year }}
                    </li>
                    <li class="year" @click="changePage('centurys')">
                        <i class="fas fa-chevron-left"></i>
                    </li>
                </ul>
                <ul
                    class="months"
                    :class="[pages.months ? 'show_this_page' : '']"
                >
                    <li
                        v-for="(month, index) in calcMonths"
                        :key="index"
                        :class="index + 1 == picked.month ? 'selected' : ''"
                        @click="pickMonth(index)"
                    >
                        {{ month.name }}
                    </li>
                </ul>
                <ul class="days" :class="[pages.days ? 'show_this_page' : '']">
                    <li
                        v-for="(day, index) in calcDays"
                        :key="index"
                        :class="day == picked.day ? 'selected' : ''"
                        @click="pickDay(day)"
                    >
                        {{ day }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex";

const calendar = {
    curentType: 0,
    curentName: "قمری",
    curentMonthIndex: 0,
    types: [
        {
            name: "قمری",
            end: 1500,
            months: [
                { name: "محرم", days: 30 },
                { name: "صفر", days: 29 },
                { name: "ربیع الاول	", days: 30 },
                { name: "ربیع الثانی", days: 29 },
                { name: "جمادی الاول", days: 30 },
                { name: "جمادی الثانی", days: 29 },
                { name: "رجب", days: 30 },
                { name: "شعبان", days: 29 },
                { name: "رمضان", days: 30 },
                { name: "شوال", days: 29 },
                { name: "ذی القعده", days: 30 },
                { name: "ذی الحجه", days: 30 },
            ],
        },
        // {
        // 	name: "شمسی",
        // 	end: 1500,
        // 	months: [
        // 		{ name: "فروردین", days: 31 },
        // 		{ name: "اردیبهشت", days: 31 },
        // 		{ name: "خرداد", days: 31 },
        // 		{ name: "تیر", days: 31 },
        // 		{ name: "مرداد", days: 31 },
        // 		{ name: "شهریور", days: 31 },
        // 		{ name: "مهر", days: 30 },
        // 		{ name: "آبان", days: 30 },
        // 		{ name: "آذر", days: 30 },
        // 		{ name: "دی", days: 30 },
        // 		{ name: "بهمن", days: 30 },
        // 		{ name: "اسفند", days: 30 }
        // 	]
        // },
        // {
        // 	name: "میلادی",
        // 	end: 2100,
        // 	months: [
        // 		{ name: "ژانویه", days: 31 },
        // 		{ name: "فوریه", days: 29 },
        // 		{ name: "مارس", days: 31 },
        // 		{ name: "آوریل", days: 30 },
        // 		{ name: "می", days: 31 },
        // 		{ name: "ژوئن", days: 30 },
        // 		{ name: "ژوئیه", days: 31 },
        // 		{ name: "اوت", days: 31 },
        // 		{ name: "سپتامبر", days: 30 },
        // 		{ name: "اکتبر", days: 31 },
        // 		{ name: "نوامبر", days: 30 },
        // 		{ name: "دسامبر", days: 31 }
        // 	]
        // }
    ],
};
export default {
    props: ["docLayer"],
    data() {
        return {
            displayPicker: false,
            calendar: calendar,
            pages: {
                centurys: true,
                years: false,
                months: false,
                days: false,
            },
            years: [],
            newPageZindex: "years",
        };
    },
    computed: {
        showDateForOprator() {
            const picked = this.picked;
            if (!picked.year) return "تاریخ";
            if (picked.month == "00")
                return `سال ${picked.year.replace(/[-]/gi, "")}`;
            else
                return `
				${picked.day} / 
				${picked.month} / 
				${picked.year.replace(/[-]/gi, "")}`;
        },
        picked() {
            return this.$store.getters.DocLayer.date_props;
        },
        curentMonthName() {
            const pickedMonth = Number(this.picked.month - 1);
            const calendarCurentType = this.calendar.curentType;
            const name = this.calendar.types[calendarCurentType].months[
                pickedMonth == -1 ? 0 : pickedMonth
            ].name;
            return name;
        },
        centurys() {
            let centurys = [-100, -50],
                years = 0,
                end;
            const thisTypeEnd = this.calendar.types[this.calendar.curentType]
                .end;
            end = (thisTypeEnd / 100) * 2;
            for (let index = 0; index < end; index++) {
                centurys.push(years);
                years = years + 50;
            }
            return centurys;
        },
        calcMonths() {
            const ThisType = this.calendar.curentType;
            const months = this.calendar.types[ThisType].months;
            return months;
        },
        calcDays() {
            const curentType = this.calendar.curentType;
            const thisType = this.calendar.types[curentType];
            const curentMonth = this.calendar.curentMonthIndex;
            const days = thisType.months[curentMonth].days;
            return days;
        },
    },
    methods: {
        ...mapMutations("docs", ["ADD_DATE"]),
        changeType() {
            const type = this.calendar;
            if (type.curentType < type.types.length - 1) {
                type.curentType++;
                type.curentName = type.types[type.curentType].name;
                return;
            }
            type.curentType = 0;
            type.curentName = type.types[type.curentType].name;
        },
        changePage(page) {
            const pages = this.pages;
            pages[page] = true;

            for (let key in pages) {
                const hasPagesProperty = Object.prototype.hasOwnProperty.call(
                    pages,
                    key
                );
                if (hasPagesProperty) {
                    if (key == page) {
                        pages[key] = true;
                    } else {
                        pages[key] = false;
                    }
                }
            }
        },
        async pickCentury(century) {
            this.ADD_DATE({ century });
            await this.fillYears();
            this.changePage("years");
        },
        fillYears() {
            this.years = [];
            let startYear = this.picked.century,
                endYear = startYear + 50;
            for (startYear; startYear < endYear; startYear++) {
                this.years.push(startYear);
            }
        },
        pickYear(year) {
            this.ADD_DATE({ year: year.toString() });
            this.changePage("months");
        },
        zeroCheck(num) {
            const condition = num < 10;
            const stringNum = num.toString();
            return condition ? `0${stringNum}` : stringNum;
        },
        pickMonth(index) {
            this.calendar.curentMonthIndex = index;
            const num = index + 1;
            this.ADD_DATE({ month: this.zeroCheck(num) });
            this.changePage("days");
        },
        async pickDay(day) {
            this.ADD_DATE({ day: this.zeroCheck(day) });
            this.hidePicker();
            setTimeout(() => {
                this.changePage("centurys");
            }, 1000);
        },
        showPicker() {
            document.addEventListener("click", this.documentClick);
            this.displayPicker = true;
        },
        hidePicker() {
            document.removeEventListener("click", this.documentClick);
            this.displayPicker = false;
        },
        togglePicker() {
            this.displayPicker ? this.hidePicker() : this.showPicker();
        },
        documentClick(e) {
            var el = document.querySelector(".date_time_picker_wrapper"),
                target = e.target;
            if (el !== target && !el.contains(target)) {
                this.hidePicker();
            }
        },
    },
    mounted() {},
};
</script>