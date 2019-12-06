<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="字段管理" name="field_manage">
        <el-row type="flex" justify="end">
          <el-button type="primary" size="small" @click="fieldManageAddHandle">新增</el-button>
        </el-row>
        <el-table
          border
          :data="tableData"
          style="width: 100%; margin-top: 10px;"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="label"
            label="展示列名"
          />
          <el-table-column
            prop="name"
            label="列名"
          />
          <el-table-column
            prop="type"
            label="类型"
          />
          <el-table-column
            prop="length"
            label="长度"
          />
          <el-table-column
            prop="allow_null"
            label="Allow Null"
          />
          <el-table-column
            prop="default"
            label="默认值"
          />
          <el-table-column
            prop="comment"
            label="备注"
          />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
          >
            <template slot-scope="scope">
              <el-button type="text" size="mini">编辑</el-button>
              <el-button type="text" size="mini" @click="handleClick(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="列表管理" name="list_manage">列表管理</el-tab-pane>
      <el-tab-pane label="表单管理" name="form_manage">表单管理</el-tab-pane>
    </el-tabs>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFieldManageVisible">
      <el-form ref="fieldMangeDataForm" :rules="fieldMangeRules" :model="fieldManageTmp" label-position="left" label-width="80px" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Show',
  directives: { waves },
  data() {
    return {
      activeName: 'field_manage',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogFieldManageVisible: false,
      fieldManageTmp: {
        id: undefined,
        content_table_id: 0,
        label: '',
        name: ''
      },
      fieldMangeRules: {

      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    const id = this.$route.query.id
    this.httpGetColumnInfo(id)
  },
  methods: {
    httpGetColumnInfo(id) {
      console.log(id)
    },
    handleClick() {

    },
    fieldManageAddHandle() {
      this.dialogStatus = 'create'
      this.dialogFieldManageVisible = true
    }
  }
}
</script>
