// seed-data.js
// Seeds all default ToonCakes menu items into localStorage on first visit.
// Uses tc_seeded_v1 flag — runs only ONCE per browser; never overwrites edited items.

(function () {
  'use strict';

  // Default items are also exposed as window.TC_SEED so the admin
  // Menu Manager can show / re-load the website's built-in items.
  var TC_SEED = window.TC_SEED = {};
  var alreadySeeded = !!localStorage.getItem('tc_seeded_v1');
  window.TC_SEEDED_NOW = !alreadySeeded;   // true = this page load just filled in the defaults

  // ── Merge helper: adds items whose IDs don't already exist in the stored array ──
  function mergeIn(key, defaults) {
    TC_SEED[key] = defaults;
    if (alreadySeeded) return;   // seeding itself still runs only ONCE per browser
    var existing = [];
    try { existing = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
    var existingIds = {};
    existing.forEach(function (x) { existingIds[x.id] = true; });
    var toAdd = defaults.filter(function (d) { return !existingIds[d.id]; });
    if (toAdd.length) {
      localStorage.setItem(key, JSON.stringify(toAdd.concat(existing)));
    }
  }


  // ================================================================
  // CAKES  (tc_menu_cakes)
  // ================================================================
  mergeIn('tc_menu_cakes', [
    { id:'seed_c_1',  name:'Classic Chocolate Birthday', category:'birthday',    badge:'Best Seller',      price:699,  desc:'Rich moist chocolate sponge with silky ganache and chocolate cream frosting.',                                                       image:'', active:true },
    { id:'seed_c_2',  name:'Vanilla Fresh Cream',        category:'birthday',    badge:'Popular',          price:649,  desc:'Light fluffy vanilla sponge with fresh whipped cream and seasonal fruit toppings.',                                                  image:'', active:true },
    { id:'seed_c_3',  name:'Strawberry Dream',           category:'birthday',    badge:'Trending',         price:749,  desc:"Fresh strawberry layers with cream cheese frosting and strawberry compote. Girls' favourite!",                                        image:'', active:true },
    { id:'seed_c_4',  name:'Red Velvet Bliss',           category:'birthday',    badge:'',                 price:799,  desc:'Velvety red sponge with rich cream cheese frosting — a luxury birthday treat.',                                                       image:'', active:true },
    { id:'seed_c_5',  name:'Butterscotch Caramel',       category:'birthday',    badge:'',                 price:699,  desc:'Sweet butterscotch cake with caramel sauce drizzle and praline bits. Crowd pleaser!',                                                 image:'', active:true },
    { id:'seed_c_6',  name:'Black Forest Special',       category:'birthday',    badge:'',                 price:799,  desc:'Classic black forest with dark chocolate sponge, whipped cream, and cherry toppings.',                                               image:'', active:true },
    { id:'seed_c_7',  name:'Elegant Floral Wedding',     category:'wedding',     badge:'Wedding',          price:1499, desc:'Stunning tiered wedding cake with edible floral decorations. A beautiful centerpiece!',                                               image:'', active:true },
    { id:'seed_c_8',  name:'Rose Gold Tiered',           category:'wedding',     badge:'Wedding',          price:1799, desc:'Gorgeous 3-tier rose gold cake with metallic effect and fresh rose decorations.',                                                     image:'', active:true },
    { id:'seed_c_9',  name:'Heart Shape Romance',        category:'anniversary', badge:'Anniversary',      price:849,  desc:'Beautiful heart-shaped cake with red velvet sponge and rose decoration. Perfect for couples!',                                        image:'', active:true },
    { id:'seed_c_10', name:'Golden Celebration',         category:'anniversary', badge:'Anniversary',      price:1199, desc:'Elegant gold-themed cake with edible gold leaf, perfect for milestone anniversaries.',                                                image:'', active:true },
    { id:'seed_c_11', name:'Unicorn Magic',              category:'kids',        badge:"Kids' Fav",        price:999,  desc:'Magical rainbow unicorn cake with colorful swirls and fondant unicorn horn and ears.',                                               image:'', active:true },
    { id:'seed_c_12', name:'Cars & Superheroes',         category:'kids',        badge:"Kids' Fav",        price:1099, desc:"Custom cartoon/superhero themed cake — choose your child's favourite character!",                                                      image:'', active:true },
    { id:'seed_c_13', name:'Rainbow Layer Cake',         category:'kids',        badge:"Kids' Fav",        price:1199, desc:'Stunning 6-layer rainbow sponge cake — a surprise delight when you cut it open!',                                                    image:'', active:true },
    { id:'seed_c_14', name:'Fondant Sculpted Cake',      category:'fondant',     badge:'Fondant Art',      price:1299, desc:'Hand-sculpted fondant art with intricate details. Completely personalised for your event theme!',                                     image:'', active:true },
    { id:'seed_c_15', name:'Floral Fondant Cake',        category:'fondant',     badge:'Floral Fondant',   price:1199, desc:'Elegant fondant flowers handcrafted petal by petal. A showstopper for weddings and anniversaries.',                                  image:'', active:true },
    { id:'seed_c_16', name:'Pinata Surprise Cake',       category:'special',     badge:'Pinata',           price:1299, desc:'Break open to reveal candies inside! The most fun and shareable cake — loved by all ages.',                                           image:'', active:true },
    { id:'seed_c_17', name:'Number Shape Cake',          category:'special',     badge:'Number',           price:1099, desc:'Trendy number-shaped cake for milestone birthdays — 1, 18, 21, 25, 50 and more!',                                                   image:'', active:true },
    { id:'seed_c_18', name:'Half Saree / Puberty Cake',  category:'special',     badge:'Half Saree',       price:949,  desc:'Beautiful floral and traditional designs for half saree ceremony and puberty celebrations.',                                           image:'', active:true }
  ]);

  // ================================================================
  // DESSERTS  (tc_menu_desserts)
  // ================================================================
  mergeIn('tc_menu_desserts', [
    // Brownies
    { id:'seed_d_1',  name:'Classic Fudge Brownie',         category:'brownies',          price:'₹80/piece | ₹450/box of 6',       desc:"Dense, rich, ultra-fudgy eggless brownies with a crinkle top. Chocolate lover's dream!",                                               image:'', active:true },
    { id:'seed_d_2',  name:'Walnut Brownie',                 category:'brownies',          price:'₹90/piece | ₹500/box of 6',       desc:'Fudgy chocolate brownie loaded with crunchy walnut pieces. Perfect texture in every bite.',                                             image:'', active:true },
    { id:'seed_d_3',  name:'Nutella Swirl Brownie',          category:'brownies',          price:'₹100/piece | ₹550/box of 6',      desc:'Chocolate brownie with gorgeous Nutella swirls baked in. Gooey, irresistible, and unforgettable!',                                     image:'', active:true },
    // Tiramisu
    { id:'seed_d_4',  name:'Classic Tiramisu',               category:'tiramisu',          price:'₹180/serving | ₹900/6 servings',  desc:'Authentic Italian-inspired tiramisu with coffee-soaked layers, mascarpone cream & cocoa. Eggless perfection!',                        image:'', active:true },
    { id:'seed_d_5',  name:'Chocolate Tiramisu',             category:'tiramisu',          price:'₹200/serving',                    desc:'Classic tiramisu with a rich chocolate twist — double chocolate layers with espresso cream.',                                            image:'', active:true },
    { id:'seed_d_6',  name:'Tiramisu Jar',                   category:'tiramisu jars',     price:'₹160/jar',                        desc:'Single-serve tiramisu in a gorgeous jar. Perfect for gifting, parties, or a personal treat!',                                          image:'', active:true },
    // Cheesecakes
    { id:'seed_d_7',  name:'New York Cheesecake',            category:'cheesecake',        price:'₹220/slice | ₹1,200/whole',       desc:'Dense, creamy, velvety New York style cheesecake with a buttery biscuit base. Eggless & divine!',                                    image:'', active:true },
    { id:'seed_d_8',  name:'Blueberry Cheesecake',           category:'cheesecake',        price:'₹240/slice | ₹1,400/whole',       desc:'Creamy eggless cheesecake topped with a gorgeous fresh blueberry compote. Stunning & delicious!',                                     image:'', active:true },
    { id:'seed_d_9',  name:'Strawberry Cheesecake',          category:'cheesecake',        price:'₹230/slice | ₹1,300/whole',       desc:'Luscious cheesecake with fresh strawberry topping and coulis. A classic everyone loves!',                                              image:'', active:true },
    { id:'seed_d_10', name:'Oreo No-Bake Cheesecake',        category:'cheesecake',        price:'₹210/slice | ₹1,100/whole',       desc:'Cookies and cream no-bake cheesecake with Oreo crust and Oreo cream cheese filling. Absolutely addictive!',                            image:'', active:true },
    // Tres Leches
    { id:'seed_d_11', name:'Classic Tres Leches',            category:'tresleches',        price:'₹750/kg',                         desc:'Super soft sponge soaked in three milks — condensed, evaporated & fresh cream. Heavenly melt-in-mouth!',                              image:'', active:true },
    { id:'seed_d_12', name:'Chocolate Tres Leches',          category:'tresleches',        price:'₹799/kg',                         desc:'Chocolate sponge version of tres leches — soaked in chocolate-milk trio with cocoa whipped cream!',                                    image:'', active:true },
    { id:'seed_d_13', name:'Mango Tres Leches',              category:'tresleches',        price:'₹799/kg',                         desc:'Summer favourite! Mango-infused three-milk cake with fresh mango pulp topping. Seasonal special!',                                     image:'', active:true },
    // Cookies
    { id:'seed_d_14', name:'Chocolate Chip Cookies',         category:'cookies',           price:'₹60/piece | ₹650/dozen',          desc:'Classic chewy eggless chocolate chip cookies. Crisp edges, soft centre, loaded with chocolate chips!',                                 image:'', active:true },
    { id:'seed_d_15', name:'Double Chocolate Cookies',       category:'cookies',           price:'₹70/piece | ₹750/dozen',          desc:'Intense double chocolate cookies with cocoa dough and melted chocolate chunks. Chocoholic special!',                                   image:'', active:true },
    { id:'seed_d_16', name:'Snickerdoodle Cookies',          category:'cookies',           price:'₹65/piece | ₹700/dozen',          desc:'Soft cinnamon-sugar rolled cookies with a pillowy centre. Warm, cozy, and absolutely delicious!',                                     image:'', active:true },
    // Cookie Pie
    { id:'seed_d_17', name:'Chocolate Chip Cookie Pie',      category:'cookiepie',         price:'₹699/piece (8-10 servings)',       desc:'A giant gooey cookie baked in a pie dish — crispy outside, molten inside. Share it warm with ice cream!',                             image:'', active:true },
    { id:'seed_d_18', name:'Nutella Stuffed Cookie Pie',     category:'cookiepie',         price:'₹749/piece (8-10 servings)',       desc:'Gooey cookie pie with a hidden Nutella filling — cut it open for the most epic reveal!',                                              image:'', active:true },
    // Donuts
    { id:'seed_d_19', name:'Classic Glazed Donuts',          category:'donuts',            price:'₹70/piece | ₹750/dozen',          desc:'Fluffy, airy eggless donuts with a shiny sugar glaze. Light, pillowy and absolutely irresistible!',                                   image:'', active:true },
    { id:'seed_d_20', name:'Chocolate Frosted Donuts',       category:'donuts',            price:'₹80/piece | ₹850/dozen',          desc:'Fluffy donuts topped with rich chocolate glaze and colourful sprinkles. Kids go absolutely crazy for these!',                         image:'', active:true },
    { id:'seed_d_21', name:'Rainbow Sprinkle Donuts',        category:'donuts',            price:'₹85/piece | ₹900/dozen',          desc:'Colourful glazed donuts loaded with rainbow sprinkles — party-perfect and Instagram-worthy!',                                         image:'', active:true },
    { id:'seed_d_22', name:'Nutella Stuffed Donut',          category:'donuts',            price:'₹100/piece',                      desc:'Pillowy fried donut filled with silky Nutella — bite into it and watch the filling ooze out!',                                        image:'', active:true },
    // Jar Desserts
    { id:'seed_d_23', name:'Brownie Jar',                    category:'jars',              price:'₹150/jar',                        desc:'Layered brownie crumbles, chocolate mousse, and whipped cream in a beautiful jar. Perfect gift!',                                      image:'', active:true },
    { id:'seed_d_24', name:'Cheesecake Jar',                 category:'jars cheesecake',   price:'₹170/jar',                        desc:'Creamy cheesecake in a jar with biscuit crumble base and berry topping. Individual, fresh, delicious!',                                image:'', active:true }
  ]);

  // ================================================================
  // CLASSES  (tc_menu_classes)
  // ================================================================
  mergeIn('tc_menu_classes', [
    {
      id:'seed_cl_1', name:'Beginner Basics — Eggless Baking',
      courseType:'live', price:0, duration:'2 Hours',
      topics:'What is eggless baking & why it works,Basic baking tools you need at home,Make a simple vanilla sponge cake,Basic cream frosting technique,Q&A with the instructor',
      desc:'Perfect for absolute beginners. Learn the fundamentals of eggless baking from scratch!',
      videos:[], pdfs:[], schedule:'', seats:'20', mode:'both', image:'', active:true
    },
    {
      id:'seed_cl_2', name:'Simple Chocolate Cake — Live Demo',
      courseType:'live', price:0, duration:'1.5 Hours',
      topics:'Eggless chocolate sponge recipe,Ganache preparation tips,Simple piping and decoration,Common mistakes to avoid,Live demo — watch and bake along!',
      desc:'Watch and learn a live baking demonstration of a delicious eggless chocolate cake!',
      videos:[], pdfs:[], schedule:'', seats:'30', mode:'online', image:'', active:true
    },
    {
      id:'seed_cl_3', name:'Advanced Eggless Baking — Full Course',
      courseType:'live', price:2499, duration:'5 Days',
      topics:'10+ eggless cake recipes (chocolate, red velvet, cheesecake & more),Professional frosting & piping techniques,Fondant basics & figurine making,Cake layering & filling secrets,Decoration for birthdays & weddings,Recipes PDF included,Certificate of completion',
      desc:'Master 10+ eggless cake recipes with professional techniques used in ToonCakes bakery!',
      videos:[], pdfs:[], schedule:'', seats:'15', mode:'both', image:'', active:true
    },
    {
      id:'seed_cl_4', name:'Cake Decoration Masterclass',
      courseType:'live', price:1999, duration:'3 Days',
      topics:'Fondant covering & smoothing,Edible flower making,Rosette & ruffles piping,Drip cake & mirror glaze,Fondant figurines & toppers,Metallic & gold leaf effects,Certificate of completion',
      desc:'Become a cake decoration expert with hands-on in-person training!',
      videos:[], pdfs:[], schedule:'', seats:'10', mode:'in-person', image:'', active:true
    },
    {
      id:'seed_cl_5', name:'Start Your Cake Business — Entrepreneur Course',
      courseType:'live', price:3999, duration:'7 Days',
      topics:'Professional cake recipe development,Pricing & costing your cakes,Instagram & social media marketing,WhatsApp business for cake orders,Packaging & delivery best practices,Building your customer base,1-on-1 mentorship session included',
      desc:'Turn your baking passion into a profitable business with this complete entrepreneur course!',
      videos:[], pdfs:[], schedule:'', seats:'10', mode:'online', image:'', active:true
    },
    {
      id:'seed_cl_6', name:'One-Day Baking Workshop',
      courseType:'live', price:1299, duration:'Full Day (6 hrs)',
      topics:'Bake 3 different eggless cakes,Frosting & basic decoration included,Take your baked cakes home,All ingredients provided,Recipe cards to take home,Great for groups & friends!',
      desc:'Learn 3 eggless cakes in a single fun-filled day — perfect for beginners and baking enthusiasts!',
      videos:[], pdfs:[], schedule:'', seats:'12', mode:'both', image:'', active:true
    }
  ]);

  // ================================================================
  // RECIPES  (tc_menu_recipes)
  // ================================================================
  mergeIn('tc_menu_recipes', [
    // Free Recipes
    {
      id:'seed_r_1', name:'Basic Vanilla Sponge Cake',
      type:'free', price:0, difficulty:'Easy',
      tags:'vanilla, beginner, sponge, eggless',
      videoUrl:'', pdfUrl:'',
      desc:'The foundation of all baking — a soft, fluffy eggless vanilla sponge cake that works for any occasion.',
      image:'', active:true
    },
    {
      id:'seed_r_2', name:'Simple Chocolate Cake',
      type:'free', price:0, difficulty:'Easy',
      tags:'chocolate, beginner, ganache, eggless',
      videoUrl:'', pdfUrl:'',
      desc:'A rich, moist eggless chocolate cake recipe that even a first-time baker can nail perfectly!',
      image:'', active:true
    },
    {
      id:'seed_r_3', name:'Easy Eggless Cupcakes',
      type:'free', price:0, difficulty:'Easy',
      tags:'cupcakes, beginner, frosting, party',
      videoUrl:'', pdfUrl:'',
      desc:'Adorable, fluffy eggless cupcakes — perfect for parties, gifting, or a sweet afternoon treat.',
      image:'', active:true
    },
    // Paid Recipes
    {
      id:'seed_r_4', name:'Complete Eggless Cake Bible',
      type:'paid', price:499, difficulty:'All Levels',
      tags:'complete guide, 20+ recipes, professional, PDF',
      videoUrl:'', pdfUrl:'',
      desc:'Our most comprehensive recipe pack — 20+ eggless cake recipes used in ToonCakes bakery. From basics to advanced!',
      image:'', active:true
    },
    {
      id:'seed_r_5', name:'Frosting & Decoration Secrets',
      type:'paid', price:349, difficulty:'Intermediate',
      tags:'frosting, decoration, piping, fondant, techniques',
      videoUrl:'', pdfUrl:'',
      desc:'Master every type of frosting and cake decoration technique with this detailed professional guide.',
      image:'', active:true
    },
    {
      id:'seed_r_6', name:'Wedding & Celebration Cake Recipes',
      type:'paid', price:599, difficulty:'Advanced',
      tags:'wedding, large batch, tiered cakes, celebration',
      videoUrl:'', pdfUrl:'',
      desc:'Professional large-batch eggless recipes for weddings, receptions, and big celebrations — tested for 50–500 servings!',
      image:'', active:true
    },
    {
      id:'seed_r_7', name:'Kids Cakes & Themed Designs',
      type:'paid', price:299, difficulty:'Beginner',
      tags:'kids, unicorn, rainbow, number cake, pinata',
      videoUrl:'', pdfUrl:'',
      desc:"Fun, colourful, kid-friendly eggless cake recipes and decoration guides. Make your child's birthday unforgettable!",
      image:'', active:true
    }
  ]);

  // Mark seeded so this never runs again
  localStorage.setItem('tc_seeded_v1', '1');

})();
