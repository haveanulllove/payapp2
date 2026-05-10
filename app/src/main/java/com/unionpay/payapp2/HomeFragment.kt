package com.unionpay.payapp2

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView

class HomeFragment : Fragment() {

    data class IconItem(
        val name: String,
        val iconRes: Int
    )

    private val topActions = listOf(
        IconItem("收付款", R.drawable.ic_top_pay),
        IconItem("出行", R.drawable.ic_top_travel),
        IconItem("扫一扫", R.drawable.ic_top_scan),
        IconItem("转账", R.drawable.ic_top_transfer)
    )

    private val gridItems = listOf(
        IconItem("乘公交", R.drawable.ic_service_bus),
        IconItem("转账", R.drawable.ic_service_transfer),
        IconItem("政府促消费", R.drawable.ic_service_gov_consume),
        IconItem("信用卡还款", R.drawable.ic_service_credit_repay),
        IconItem("玩赚中心", R.drawable.ic_service_earn),
        IconItem("查银行卡", R.drawable.ic_service_bank_card),
        IconItem("手机充值", R.drawable.ic_service_mobile_recharge),
        IconItem("借款", R.drawable.ic_service_loan),
        IconItem("申请信用卡", R.drawable.ic_service_apply_card),
        IconItem("生活缴费", R.drawable.ic_service_life_payment),
        IconItem("政务民生", R.drawable.ic_service_public_service),
        IconItem("支付守护", R.drawable.ic_service_payment_guard),
        IconItem("权益精选", R.drawable.ic_service_benefits),
        IconItem("我的小程序", R.drawable.ic_service_mini_programs),
        IconItem("更多", R.drawable.ic_service_more)
    )

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        bindTopActions(view)

        val rvGrid = view.findViewById<RecyclerView>(R.id.rvGrid)
        rvGrid.layoutManager = GridLayoutManager(context, 5)
        rvGrid.adapter = GridAdapter(gridItems)
        rvGrid.isNestedScrollingEnabled = false
    }

    private fun bindTopActions(view: View) {
        val actionViews = listOf<View>(
            view.findViewById(R.id.actionPay),
            view.findViewById(R.id.actionTravel),
            view.findViewById(R.id.actionScan),
            view.findViewById(R.id.actionTransfer)
        )

        actionViews.zip(topActions).forEach { (actionView, action) ->
            actionView.findViewById<ImageView>(R.id.ivTopIcon).setImageResource(action.iconRes)
            actionView.findViewById<TextView>(R.id.tvTopName).text = action.name
        }
    }

    inner class GridAdapter(private val items: List<IconItem>) : RecyclerView.Adapter<GridAdapter.ViewHolder>() {
        inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val icon: ImageView = view.findViewById(R.id.ivIcon)
            val name: TextView = view.findViewById(R.id.tvName)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_grid, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = items[position]
            holder.icon.setImageResource(item.iconRes)
            holder.name.text = item.name
        }

        override fun getItemCount() = items.size
    }
}
