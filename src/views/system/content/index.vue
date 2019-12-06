<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="listQuery.name" placeholder="表名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="100px"
        align="center"
        sortable="custom"
      />
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="table_name"
        label="表名"
        width="300px"
      />
      <el-table-column
        prop="desc"
        label="描述"
      />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
          <el-button type="success" size="mini" @click="handleConfig(row.id)">
            配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-col style="text-agline">
      <el-pagination
        style="text-align: center; margin-top:10px;"
        :current-page="current_page"
        :page-sizes="[20, 40, 100, 200]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-col>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="表名" prop="table_name">
          <el-input v-if="dialogStatus==='update'" v-model="temp.table_name" disabled />
          <el-input v-if="dialogStatus==='create'" v-model="temp.table_name" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input
            v-model="temp.desc"
            type="textarea"
            :rows="2"
            maxlength="200"
            placeholder="描述内容"
            show-word-limit
          />
        </el-form-item>
      </el-form>
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
import { fetchList, createContent, updateContent, deleteContent } from '@/api/content'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Content',
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      current_page: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 20
      },
      temp: {
        id: undefined,
        name: '',
        table_name: '',
        desc: '',
        created_by: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        name: [{ required: true, message: '名称必须填写', trigger: 'change' }],
        table_name: [{ required: true, message: '表名必须填写', trigger: 'change' }],
        desc: [{ max: 200, message: '长度200个字符以内', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.current_page = response.data.current_page
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    sortChange({ order, prop }) {
      this.listQuery.sort = { order, prop }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        desc: '',
        active: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createContent(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '通知',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(() => {
            this.$notify({
              title: '通知',
              message: '操作失败',
              type: 'danger',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateContent(this.temp.id, this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '通知',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContent(row.id).then(response => {
          this.$notify({
            title: '通知',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        }).catch(() => {
          this.$notify({
            title: '通知',
            message: '操作失败',
            type: 'danger',
            duration: 2000
          })
        })
      })
    },
    handleConfig(id) {
      this.$router.push({ path: `/system/content/show`, query: { id: id }})
    }
  }
}
</script>
