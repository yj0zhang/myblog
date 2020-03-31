参考：https://www.jianshu.com/p/feede4445142

    <el-table-column>
        <template scope-slot="props">
            <el-button
               type="primary"
               size="mini"
               @click="openDialog('edit',props.row)"
               >编辑
            </el-button>
        </template>
    </el-table-column>

    // 
    
    <el-table-column
        key={index}
        label={item.name}
        width={item.width}
        {...{
            scopedSlots: {
                default: props => {
                return (
                <el-button
                    type="primary"
                    size="mini"
                    on-click={this.openDialog.bind(this,'edit',props.row)}
                    >编辑
            )
        }
        }
        }}
    />
