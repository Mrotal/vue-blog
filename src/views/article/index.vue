<template>
  <el-container style=" border: 1px solid #eee">
    <el-header>
      <el-row>
        <el-button type="primary" @click="openAdd()">新增</el-button>
        <el-button type="danger" @click="removeSelected()">删除选中</el-button>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" width="250"></el-table-column>
        <el-table-column prop="createtime" label="日期" width="150"></el-table-column>
        <el-table-column prop="title" label="姓名" width="120"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="openDetail(scope.row.id)" type="text" size="small">查看</el-button>
            <el-button @click="remove(scope.row.id)" type="text" size="small">删除</el-button>
            <el-button type="text" size="small" @click="openAdd(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="pager">
      <el-pagination
        @size-change="sizeChange"
        @current-change="indexChange"
        :page-sizes="[10, 20, 50]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="params.pagesize"
        :current-page="params.pageindex">
      </el-pagination>
    </el-footer>

    <el-dialog title="文章" :visible.sync="addShow" @close="closeAdd">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-row>
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" clearable :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="描述" prop="description">
            <el-input v-model="formData.description" placeholder="请输入描述" clearable :style="{width: '100%'}">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="编辑器" prop="content">
            <MarkdownPro v-model="formData.content" placeholder="请输入编辑器" @on-upload-image="onUploadImage" @on-ready="onReady" :style="{width: '100%'}" :exportFileName="formData.title"></MarkdownPro>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="closeAdd">取消</el-button>
        <el-button type="primary" @click="saveAdd">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文章" :visible.sync="detailShow" @close="closeDetail">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-row>
          <el-form-item label="标题" prop="title">
            {{ formData.title }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="描述" prop="description">
            {{ formData.description }}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="编辑器" prop="content">
            <MarkdownPreview :initialValue="formData.content" :theme="theme"></MarkdownPreview>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDetail">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {findPage, insert, update, getDetail, remove, removeSelected} from '@/api/article'
import {add} from '@/api/attach'
import {MarkdownPreview, MarkdownPro} from 'vue-meditor'

export default {
  components: {MarkdownPreview, MarkdownPro},
  methods: {
    getPage: function () {
      findPage(this.params).then(data => {
        this.tableData = data.data.list
        this.total = data.data.total
      })
    },
    openAdd: function (id) {
      this.addShow = true
      if (id) {
        getDetail(id).then(data => {
          this.formData = data.data
        })
      }
    },
    closeAdd: function () {
      this.addShow = false
      this.formData = {}
      this.getPage()
    },
    closeDetail: function () {
      this.detailShow = false
      this.formData = {}
    },
    saveAdd: function () {
      if (this.formData.id) {
        update(this.formData)
      } else {
        insert(this.formData)
      }
      this.addShow = false
      this.formData = {}
      this.getPage()
    },
    remove: function (id) {
      remove(id)
      this.getPage()
    },
    handleSelectionChange(val) {
      this.selected = val;
      console.log(this.selected)
    },
    removeSelected: function () {
      var ids = []
      var selected = this.selected
      if (selected.length === 0) {
        this.$message.error('请选择需要删除的文章');
        return;
      }

      for (let i = 0; i < selected.length; i++) {
        ids.push(selected[i].id)
      }

      removeSelected(ids)
      this.getPage()
    },
    openDetail: function (id) {
      this.detailShow = true
      if (id) {
        getDetail(id).then(data => {
          this.formData = data.data
        })
      }
    },
    indexChange: function (pageindex) {
      this.params.pageindex = pageindex
      this.getPage()
    },
    sizeChange: function (pagesize) {
      this.params.pagesize = pagesize
      this.getPage()
    },
    onUploadImage: function(data) {
      add(data).then((data) => {
        this.insertContent( "![image](" + data.data + ")")
      })
    },
    onReady: function(obj) {
      console.log(obj)
      this.insertContent = obj.insertContent
    },
    insertContent: function() {

    }
  },

  data() {
    return {
      tableData: [],
      formData: {},
      selected: [],
      theme: 'oneDark',
      addShow: false,
      detailShow: false,
      params: {
        pageindex: 1,
        pagesize: 10,
        title: ''
      },
      total: 10,
    }
  },
  mounted() {
    this.getPage()
  }
}
</script>

<style scoped>
.pager {
  position: fixed;
  bottom: 0;
  text-align: center;
  width: 100%;
}
</style>
