import fetch from '@/api/config';

const survey = {

   // 问卷列表
   listSurvey(params) {
      return fetch.get('api/admin/v1/survey/page', params)
   },

   // 添加问卷
   addSurvey(params) {
      return fetch.post('api/admin/v1/survey/insert', params)
   },

   //更新问卷
   updateSurvey(params) {
      return fetch.post('api/admin/v1/survey/update', params)
   },

   // 查询问卷
   getSurvey(params) {
      return fetch.get('api/admin/v1/survey/get', params)
   },

   //删除问卷
   deleteSurvey(params) {
      return fetch.post('api/admin/v1/survey/delete', params)
   },

   // 问卷问题列表
   getSurveyQuestion(params) {
      return fetch.get('api/admin/v1/question/getList', params)
   },

   // 问卷问题列表
   updateSurveyQuestion(params) {
      return fetch.json('api/admin/v1/question/update', params)
   },

   // 问卷结果
   surveyResult(params) {
      return fetch.get('api/admin/v1/survey/getResult', params)
   },

   // 问卷结果
   surveyExport(params) {
      return fetch.get('api/admin/v1/survey/export', params)
   },

};

export default survey;
