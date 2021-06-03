import React, { useState,useEffect } from 'react'
import ReactExport from 'react-export-excel'
import uniqid from 'uniqid'
import './exportExcel.style.css'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn

export default function ExportExcel(props) {
  const dataSet = props.dataSet
  const colName = props.colName
  let cols = []
  let counter = 0


  for (const key in dataSet[0]) {
    cols.push(
      <ExcelColumn
        key={uniqid()}
        label={`${colName[counter]}`}
        value={`${key}`}
      />
    )
    counter++
  }

  return (
    <div className="m-3 d-inline-flex align-items-center flex-column flex-sm-row">
      گرفتن خروجی اکسل از صفحه‌ی
      <input type="text" id="startPage" className="pageNumInput" />
      تا صفحه‌ی
      <input type="text" id="endPage" className="pageNumInput" /> .
      <button
        className="btn btn-success ml-2 "
        onClick={props.onClick}
        disabled={props.loading}
      >
        {props.loading ? 'درحال دریافت اطلاعات ...' : 'دانلود فایل اکسل'}
      </button>
      <span id="errMsgExcel" className="text-danger ml-3 mt-2"></span>
      <div style={{ display: 'none' }} id="exportExcelBox">
        <ExcelFile>
          <ExcelSheet data={dataSet} name={props.sheetName}>
            {cols.map((col) => col)}
          </ExcelSheet>
        </ExcelFile>
      </div>
    </div>
  )
}

//  async getExportExcel() {
//     const startPage = +document.querySelector('#startPage').value
//     const endPage = +document.querySelector('#endPage').value
//     const maxNumDriverInList = (endPage - startPage + 1) * 10
//     const driver_ListExcel = []
//     const limit = 200
//     const stepReqect = Math.ceil(maxNumDriverInList / limit)
//     let startPageInReq = +startPage

//     if (!startPage || !endPage || startPage > endPage) {
//       let spanErrMsg = document.querySelector('#errMsgExcel')
//       spanErrMsg.innerHTML = 'لطفاً شماره صفحات را به طور صحیح وارد کنید .'
//       setTimeout(() => {
//         spanErrMsg.innerHTML = ''
//       }, 2000)
//     } else {
//       for (let i = 0; i < stepReqect; i++) {
//         try {
//           let result = await axios({
//             url: config.app.BASE_URL + 'panel/index/drivers',
//             method: 'post',
//             headers: {
//               Authorization: `Bearer ${db.get('token').value()}`,
//               'Content-Type': 'application/json'
//             },
//             data: {
//               filter: {
//                 status: this.state.statusList,
//                 isActive: this.state.isActive
//               },

//               search: {
//                 phoneNumber: this.state.searchData[0],
//                 name: this.state.searchData[1]
//               },
//               startDate: this.state.startDate,
//               endDate: this.state.endDate,
//               limit
//             },
//             params: {
//               page: startPageInReq
//             }
//           })

//           if (result.data.status === 200) {
//             result.data.drivers.map((driver) => {
//               driver_ListExcel.push({
//                 name: `${driver.name} ${driver.familyName}`,
//                 phoneNumber: driver.phoneNumber,
//                 carName: driver.carName,
//                 city: driver.city,
//                 isActive: driver.isActive,
//                 lastTripStatus: driver.lastTripStatus,
//                 isOnline: driver.isOnline,
//                 wallet: driver.wallet,
//                 tripsDistance: driver.tripsDistance
//               })
//             })
//             startPageInReq += limit / 10
//           }
//         } catch (e) {
//           console.log(e.message)
//         }
//       }

//       this.setState({ driverListExcel: driver_ListExcel })
//       document.querySelector('#exportExcelBox button').click()
//     }
//   }


{/* <div className="m-3 d-inline-flex align-items-center flex-column flex-sm-row">

    گرفتن خروجی اکسل از صفحه‌ی
    <input type="text" id="startPage" className="pageNumInput" />
    تا صفحه‌ی
    <input type="text" id="endPage" className="pageNumInput" /> .
    <button
      className="btn btn-success ml-2 "
      onClick={() => {
        this.getExportExcel()
      }}
    >
      دانلود فایل اکسل
    </button>
    <span id="errMsgExcel" className="text-danger ml-3 mt-2"></span>
    <div style={{ display: 'none' }} id="exportExcelBox">
      <ExportExcel
        dataSet={this.state.driverListExcel}
        sheetName="لیست رانندگان"
        colName={[
          'نام و نام خانوادگی',
          'شماره همراه',
          'خودرو',
          'نام شهر',
          'وضعیت کاربری',
          'وضعیت سفر',
          'وضعیت فعالیت',
          'موجودی کیف پول',
          'پیمایش سفر ها'
        ]}
      />
    </div>
</div>
   */}
