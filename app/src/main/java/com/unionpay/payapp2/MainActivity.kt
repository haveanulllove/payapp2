package com.unionpay.payapp2

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.viewpager2.widget.ViewPager2

class MainActivity : AppCompatActivity() {

    private lateinit var viewPager: ViewPager2
    private lateinit var bottomNav: BottomNavigationView

    private val fragments = listOf(
        HomeFragment(),
        PromoFragment(),
        CardFragment(),
        FortuneFragment(),
        MineFragment()
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        viewPager = findViewById(R.id.viewPager)
        bottomNav = findViewById(R.id.bottomNav)

        viewPager.adapter = object : FragmentStateAdapter(this) {
            override fun getItemCount() = fragments.size
            override fun createFragment(position: Int) = fragments[position]
        }

        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                bottomNav.menu.getItem(position).isChecked = true
            }
        })

        bottomNav.setOnItemSelectedListener { item ->
            val index = when (item.itemId) {
                R.id.nav_home -> 0
                R.id.nav_promo -> 1
                R.id.nav_card -> 2
                R.id.nav_fortune -> 3
                R.id.nav_mine -> 4
                else -> 0
            }
            viewPager.setCurrentItem(index, false)
            true
        }
    }
}
