<template>
  <div class="wrap">
    <div class="context-box" :style="{'height': `${areaHeight}px`}" ref="context">
      <button-wrap>
        <el-button type="primary" size="mini" @click="update()">修改</el-button>
      </button-wrap>
      <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column align="center" prop="seqNum" label="排序">
        </el-table-column>
        <el-table-column prop="timeQuantum" label="时间段">
        </el-table-column>
        <el-table-column prop="reservedAmount" label="置顶位置数量">
        </el-table-column>
        <el-table-column prop="price" label="价格/分">
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改" :visible.sync="dialogFormVisible" :modal="false">
      <el-form :model="form" label-position="top">
        <el-form-item label="剩余名额">
          <el-input-number size="small" :min="0" v-model="form.reservedAmount"></el-input-number>
        </el-form-item>
        <el-form-item label="价格/分">
          <el-input-number size="small" :min="1" v-model="form.price"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="success()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ButtonWrap from "@/components/common/ButtonWrap";
// import DigForm from "./form";
import api from "apiSchool/common";

export default {
  components: { ButtonWrap },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        id: "",
        reservedAmount: "",
        price: ""
      },
      loading: false,
      currentRow: "",
      tableData: [],
      areaHeight: ""
    };
  },
  created() {
    this.getTopSetting();
  },
  mounted() {
    this.getHeight();
    window.onresize = () => {
      this.getHeight();
    };
  },
  methods: {
    getHeight() {
      this.areaHeight = window.innerHeight - 120;
    },
    getTopSetting() {
      let params = {
        pageSize: 30
      };
      api.getTopSettingList(params).then(res => {
        console.log("置顶列表", res);
        this.tableData = res.data.data.list;
      });
    },
    //修改
    update() {
      if (!this.currentRow) {
        this.$message("请选择一条数据");
        return;
      }
      console.log("row:", this.currentRow);
      this.form.id = this.currentRow.id;
      this.form.reservedAmount = this.currentRow.reservedAmount;
      this.form.price = this.currentRow.price;
      this.dialogFormVisible = true;
    },
    success() {
      this.loading = true;
      console.log("提交的数据：", this.form);
      api
        .updateTopSetting(this.form)
        .then(res => {
          console.log("修改返回：", res);
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getTopSetting();
          this.dialogFormVisible = false;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.dialogFormVisible = false;
        });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>
