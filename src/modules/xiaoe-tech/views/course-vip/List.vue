<template>
  <div>
    <QcTable ref="table" :option="option" :search-form="searchForm" :menu="menu" :column="column"></QcTable>
  </div>
</template>

<script>
import api from '../../api/course-vip'
export default {
  data() {
    return {
      option: {
        url: 'api/admin/v1/xiaoe-tech/course-vip/page'
      },
      searchForm: [
        { label: '名称', type: 'input', formName: 'name' },
        {
          label: '状态',
          type: 'select',
          formName: 'saleStatus',
          value: '',
          option: [
            { label: '全部', value: '' },
            { label: '上架', value: 0 },
            { label: '下架', value: 1 }
          ]
        }
      ],
      menu: [
        {
          label: '添加',
          type: 'primary',
          on: () => {
            this.$router.push('/main/xiaoe-tech/course-vip/form')
          }
        }
      ],
      column: [
        { label: '序号', type: 'index', width: '50px', align: 'center' },
        {
          label: '名称',
          prop: 'name',
          width: '500px',
          formatter: (row) => {
            return (
              <QcProductItem img={row.icon} title={row.name}>
                <p>
                  ￥{row.price / 100}/
                  {
                    {
                      7: '7天',
                      15: '15天',
                      31: '1个月',
                      92: '3个月',
                      183: '半年',
                      366: '1年',
                      731: '2年',
                      1827: '5年'
                    }[row.validDays]
                  }
                </p>
              </QcProductItem>
            )
          }
        },
        // {
        //   label: '有效天数',
        //   prop: 'validDays',
        //   align: 'center',
        //   formatter: row => {
        //     return (
        //       <div>
        //         {
        //           { 7: '7天', 15: '15天', 31: '1个月', 92: '3个月', 183: '半年', 366: '1年', 731: '2年', 1827: '5年' }[
        //             row.validDays
        //           ]
        //         }
        //       </div>
        //     )
        //   }
        // },
        {
          label: '状态',
          align: 'center',
          formatter: (row) => {
            return row.saleStatus == 0 ? '上架' : '下架'
          }
        },
        { label: '排序号', prop: 'sortNumber', align: 'center' },
        {
          label: '操作',
          formatter: (row) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$router.push(`/main/xiaoe-tech/course-vip/form?id=${row.id}`)
                  }}
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  onClick={() => {
                    this.$confirm('是否删除该数据?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    })
                      .then(() => {
                        api.courseVipDelete({ id: row.id }).then(() => {
                          this.$refs.table.onSearchKeep()
                        })
                      })
                      .catch(() => {})
                  }}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ]
    }
  }
}
</script>

<style></style>
