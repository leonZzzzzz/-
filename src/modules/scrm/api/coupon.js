import fetch from '@/api/config'

export default {
    // 优惠券-概况
    getRealtimeSummary(params) {
        return fetch.get('api/admin/v1/coupon-statistic/realtime-summary', params)
    },
    // 优惠券-排行榜
    getRealtimeRank(params) {
        return fetch.get('api/admin/v1/coupon-statistic/realtime-rank', params)
    },
}