export default {
    namespaced: true,
    state: {
        name: "",
        id: ""

    },
    mutations: {
        setCompanyInfo(state, obj) {
            // obj : { id: "",name : ""}
            console.log('设置成功');
            state.id = obj.id;
            state.name = obj.name;

        }


    }
}