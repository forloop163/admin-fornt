<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="listQuery.name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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
        width="70px"
        align="center"
      />
      <el-table-column label="用户名称">
        <template slot-scope="scope">
          {{ scope.row.user.username }}
        </template>
      </el-table-column>
      <el-table-column
        prop="path"
        width="300px"
        label="请求路径"
      />
      <el-table-column
        prop="action"
        label="请求方法"
      />
      <el-table-column
        prop="ip"
        label="请求IP"
      />
      <el-table-column label="请求数据">
        <template slot-scope="scope">
          {{ JSON.stringify(scope.row.data) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="请求时间"
      />
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
  </div>
</template>

<script>
import { fetchList } from '@/api/log'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'Log',
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
    }
  }
}
</script>
