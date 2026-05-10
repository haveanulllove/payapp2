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

    data class GridItem(
        val name: String,
        val iconRes: Int
    )

    private val gridItems = listOf(
        GridItem("乘公交", R.drawable.ic_service_bus),
        GridItem("转账", R.drawable.ic_service_transfer),
        GridItem("政府促消费", R.drawable.ic_service_gov_consume),
        GridItem("信用卡还款", R.drawable.ic_service_credit_repay),
        GridItem("玩赚中心", R.drawable.ic_service_earn),
        GridItem("查银行卡", R.drawable.ic_service_bank_card),
        GridItem("手机充值", R.drawable.ic_service_mobile_recharge),
        GridItem("借款", R.drawable.ic_service_loan),
        GridItem("申请信用卡", R.drawable.ic_service_apply_card),
        GridItem("生活缴费", R.drawable.ic_service_life_payment),
        GridItem("政务民生", R.drawable.ic_service_public_service),
        GridItem("支付守护", R.drawable.ic_service_payment_guard),
        GridItem("权益精选", R.drawable.ic_service_benefits),
        GridItem("我的小程序", R.drawable.ic_service_mini_programs),
        GridItem("更多", R.drawable.ic_service_more)
    )

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val rvGrid = view.findViewById<RecyclerView>(R.id.rvGrid)
        rvGrid.layoutManager = GridLayoutManager(context, 5)
        rvGrid.adapter = GridAdapter(gridItems)
        rvGrid.isNestedScrollingEnabled = false
    }

    inner class GridAdapter(private val items: List<GridItem>) : RecyclerView.Adapter<GridAdapter.ViewHolder>() {
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
