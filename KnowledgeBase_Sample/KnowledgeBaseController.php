<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\KnowledgeBase;
use App\KnowledgeBaseCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

/**
 * Class KnowledgeBaseController
 * @package App\Http\Controllers\Admin
 */
class KnowledgeBaseController extends Controller
{

    /**
     * KnowledgeBaseController constructor.
     */
    public function __construct()
    {
        View::share('active', 'knowledgebase');
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $articles = KnowledgeBase::all();

        return view('admin.knowledgebase.knowledge_base', [
            'title' => 'Knowledge Base',
            'articles' => $articles,
            'submenu_active' => 'knowledgebase'
        ]);
    }

    /**
     * @param Request $request
     * @return array|\Illuminate\Database\Eloquent\Collection
     */
    public function search(Request $request)
    {
        $search = $request->get('search');
        if (preg_match('/[А-Яа-яЁё]/u', $search)) {
            return [];
        }

        $articles = KnowledgeBase::search($search)->get();
        return $articles;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function add(Request $request)
    {
        $categories = KnowledgeBaseCategories::all();

        if ($request->isMethod('post')) {

            $this->validate($request, [
                'content' => 'required',
                'header' => 'required|max:255',
            ]);

            $data = [
                'content' => $request->get('content'),
                'header' => $request->get('header'),
                'knowledge_base_categories_id' => $request->get('article_category'),
            ];

            $article = new KnowledgeBase($data);
            $article->save();

            return redirect('administrator/knowledgebase');
        }

        return view('admin.knowledgebase.add_knowledge_base', [
            'title' => 'Add Article',
            'categories' => $categories,
            'submenu_active' => 'knowledgebase'
        ]);
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function edit($id, Request $request)
    {
        $article = KnowledgeBase::find($id);
        $categories = KnowledgeBaseCategories::all();

        if ($request->isMethod('post')) {

            $this->validate($request, [
                'content' => 'required',
                'header' => 'required|max:255',
            ]);

            $data = [
                'content' => $request->get('content'),
                'header' => $request->get('header'),
                'knowledge_base_categories_id' => $request->get('article_category'),
            ];
            $article->update($data);

            return redirect('administrator/knowledgebase');
        }

        return view('admin.knowledgebase.edit_knowledge_base', [
            'title' => 'Edit Article',
            'categories' => $categories,
            'article' => $article,
            'submenu_active' => 'knowledgebase'
        ]);

    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete($id, Request $request)
    {
        if ($request->isMethod('post')) {
            $article = KnowledgeBase::find($id);
            if ($article->delete()) {
                return response()->json([
                    'error' => false
                ]);
            }
        }

        return response()->json([
            'error' => true
        ]);
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function categories()
    {
        $knowledge_base_categories = KnowledgeBaseCategories::orderBy('order')->get();

        return view('admin.knowledgebase.knowledge_base_categories', [
            'title' => 'Knowledge Base Categories',
            'categories' => $knowledge_base_categories,
            'submenu_active' => 'knowledgebase-categories'
        ]);
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function editCategory($id, Request $request)
    {
        $category = KnowledgeBaseCategories::find($id);

        if ($request->isMethod('post')) {

            $this->validate($request, [
                'name' => 'required|max:255'
            ]);

            $data = $request->toArray();
            $category->update($data);

            return redirect('administrator/knowledgebase-categories');
        }

        return view('admin.knowledgebase.edit_category', [
            'title' => 'Edit Knowledge Base Category',
            'category' => $category,
            'submenu_active' => 'knowledgebase-categories',
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector|\Illuminate\View\View
     */
    public function addCategory(Request $request)
    {
        if ($request->isMethod('post')) {

            $this->validate($request, [
                'name' => 'required|max:255'
            ]);

            $data = [
                'name' => $request->get('name'),
                'order' => KnowledgeBaseCategories::all()->count() + 1
            ];

            $category = new KnowledgeBaseCategories($data);
            $category->save();

            return redirect('administrator/knowledgebase-categories');
        }

        return view('admin.knowledgebase.add_category', [
            'title' => 'Add Knowledge Base Category',
            'submenu_active' => 'knowledgebase-categories'
        ]);
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteCategory($id, Request $request)
    {
        if ($request->isMethod('post')) {

            $category = KnowledgeBaseCategories::find($id);

            if ($category->knowledgebaseArticles->count() > 0) {
                return response()->json([
                    'error' => true,
                    'notification' => 'Please, remove all articles belongs to this category!'
                ]);
            }

            $new_order = KnowledgeBaseCategories::all()->count();
            $category->moveOrder($new_order);

            if ($category->delete()) {
                return response()->json([
                    'error' => false
                ]);
            }
        }

        return response()->json([
            'error' => true
        ]);
    }

    /**
     * @param $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveCategory($id, Request $request)
    {
        if ($request->isMethod('post')) {

            $category = KnowledgeBaseCategories::find($id);

            if ($request->get('type') === 'up' && $category->order > 1) {
                $new_order = $category->order - 1;
            } elseif ($request->get('type') === 'down' && ($category->order + 1) <= KnowledgeBaseCategories::count()) {
                $new_order = $category->order + 1;
            } else {
                return response()->json([
                    'error' => true
                ]);
            }

            $category->moveOrder($new_order);

            if ($category->update(['order' => $new_order])) {
                return response()->json([
                    'error' => false
                ]);
            }
        }

        return response()->json([
            'error' => true
        ]);
    }
}
